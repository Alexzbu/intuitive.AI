"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from "next/navigation"
import { gql, useQuery } from "@apollo/client"
import client from '@/utils/apolloClient'
import Loading from '@/components/Loading'
import Link from "next/link"

const GET_COURSE_QUERY = gql`
         query getCourse($id: ID!) {
             getCourse(id: $id) { 
               name
               description
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

const CourseDetails = () => {
   const searchParams = useSearchParams();
   const courseId = searchParams.get("id")
   const { data, loading, error, refetch } = useQuery(GET_COURSE_QUERY, {
      client,
      variables: { id: courseId },
      skip: !courseId,
   })


   return (
      <div className="container">
         {loading && <Loading />}
         <div className="course-card-deteils">
            <div className="course-card__content">
               <h2 className="course-card__title">{data?.getCourse.name}</h2>
               <p className="course-card__number">{data?.getCourse.description}</p>
               {data?.getCourse.sections.edges.map((section) => (
                  < p className="course-card__number" key={section.node.objectId}>{section.node.name} </p>
               ))}
            </div>
            <div className="course-card__action">
               <Link href={`/go-course?id=${courseId}`} className="course-card__link">GO TO COURSE</Link>
            </div>
         </div>
      </div >
   )
}

export default CourseDetails