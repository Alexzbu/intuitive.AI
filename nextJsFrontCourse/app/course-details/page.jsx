"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from "next/navigation"
import { gql, useQuery, useMutation } from "@apollo/client"
import client from '@/utils/apolloClient'
import Loading from '@/components/Loading'
import Link from "next/link"

const GET_COURSE_QUERY = gql`
         query getCourse($id: ID!) {
             getCourse(id: $id) {
               name
               description
               createdBy {
                 objectId
               }
               sections(order:createdAt_ASC){
                  edges{
                     node{
                      objectId
                      name
                     }
                  }
               }
            }
         }`

const IS_ENROLLED_QUERY = gql`
         query isEnrolledInCourse($courseId: ID!, $userId: ID!) {
             isEnrolledInCourse(courseId: $courseId, userId: $userId)
         }`

const ENROLL_MUTATION = gql`
         mutation enrollInCourse($courseId: ID!, $userId: ID!) {
             enrollInCourse(courseId: $courseId, userId: $userId)
         }`

const CourseDetails = () => {
   const router = useRouter()
   const searchParams = useSearchParams()
   const courseId = searchParams.get("id")

   const [user, setUser] = useState(null)
   const [userLoaded, setUserLoaded] = useState(false)
   const [enrolled, setEnrolled] = useState(false)

   useEffect(() => {
      try {
         const stored = localStorage.getItem('user')
         if (stored) setUser(JSON.parse(stored))
      } catch {}
      setUserLoaded(true)
   }, [])

   const { data, loading } = useQuery(GET_COURSE_QUERY, {
      client,
      variables: { id: courseId },
      skip: !courseId,
   })

   const { data: enrollData } = useQuery(IS_ENROLLED_QUERY, {
      client,
      variables: { courseId, userId: user?.objectId },
      skip: !courseId || !user?.objectId || !userLoaded,
   })

   useEffect(() => {
      if (enrollData?.isEnrolledInCourse) setEnrolled(true)
   }, [enrollData])

   const [enrollInCourse, { loading: enrollLoading }] = useMutation(ENROLL_MUTATION, { client })

   const isCreator = user?.objectId && data?.getCourse?.createdBy?.objectId === user.objectId
   const canAccess = isCreator || enrolled

   const handleRegister = async () => {
      if (!user) {
         router.push('/login')
         return
      }
      try {
         await enrollInCourse({ variables: { courseId, userId: user.objectId } })
         setEnrolled(true)
      } catch (error) {
         console.error('Enrollment failed:', error)
      }
   }

   return (
      <div className="container">
         {loading && <Loading />}
         <div className="course-card-deteils">
            <div className="course-card__content">
               <h2 className="course-card__title">{data?.getCourse.name}</h2>
               <p className="course-card__number">{data?.getCourse.description}</p>
               {data?.getCourse.sections.edges.map((section) => (
                  <p className="course-card__number" key={section.node.objectId}>{section.node.name}</p>
               ))}
            </div>
            <div className="course-card__action">
               {canAccess ? (
                  <Link href={`/course?id=${courseId}`} className="course-card__link">GO TO COURSE</Link>
               ) : (
                  <button
                     className="course-card__link"
                     onClick={handleRegister}
                     disabled={enrollLoading}
                  >
                     {enrollLoading ? 'REGISTERING...' : 'REGISTER FOR COURSE'}
                  </button>
               )}
            </div>
         </div>
      </div>
   )
}

export default CourseDetails
