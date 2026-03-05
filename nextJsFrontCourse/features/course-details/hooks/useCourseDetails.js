"use client"

import { useState, useEffect, useCallback } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { useRouter, useSearchParams } from "next/navigation"
import client from "@/utils/apolloClient"
import {
   GET_SESSIONS_QUERY,
   IS_ENROLLED_QUERY,
   ENROLL_MUTATION,
} from "../api/courseQueries"

export function useCourseDetails() {
   const router = useRouter()
   const searchParams = useSearchParams()
   const courseId = searchParams.get("id")

   const [user, setUser] = useState(null)
   const [userLoaded, setUserLoaded] = useState(false)
   const [enrolled, setEnrolled] = useState(false)
   const [showFullDesc, setShowFullDesc] = useState(false)
   const [selectedSession, setSelectedSession] = useState(null)

   // Course fetched via REST to avoid GraphQL schema field issues
   const [course, setCourse] = useState(null)
   const [loading, setLoading] = useState(false)

   useEffect(() => {
      try {
         const stored = localStorage.getItem("user")
         if (stored) setUser(JSON.parse(stored))
      } catch { }
      setUserLoaded(true)
   }, [])

   const fetchCourse = useCallback(async () => {
      if (!courseId) return
      setLoading(true)
      try {
         const res = await fetch(
            `${process.env.NEXT_PUBLIC_SOCKET_URL}/parse/classes/Course/${courseId}`,
            {
               headers: {
                  "X-Parse-Application-Id": process.env.NEXT_PUBLIC_PARSE_APP_ID,
                  "X-Parse-Master-Key": process.env.NEXT_PUBLIC_PARSE_MASTER_KEY,
               },
            }
         )
         const data = await res.json()
         // Map Parse REST response to expected shape
         setCourse({
            ...data,
            objectId: data.objectId,
            name: data.name,
            subtitle: data.subtitle,
            description: data.description,
            contents: data.contents,
            duration_hours: data.duration_hours,
            location: data.location,
            price: data.price,
            registration_deadline: data.registration_deadline,
            what_you_learn: data.what_you_learn || [],
            further_information: data.further_information,
            thumbnail: data.thumbnail,
            target_group: data.target_group,
            recommendation: data.recommendation,
            // createdBy from REST is a Pointer: { __type, className, objectId }
            createdBy: data.createdBy ?? null,
            // sections not available via REST — keep empty, use GraphQL if needed
            sections: null,
         })
      } catch (err) {
         console.error("Failed to fetch course:", err)
      } finally {
         setLoading(false)
      }
   }, [courseId])

   useEffect(() => { fetchCourse() }, [fetchCourse])

   const { data: sessionsData } = useQuery(GET_SESSIONS_QUERY, {
      client,
      variables: { courseId },
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

   const sessions = sessionsData?.getCourseSessionsByCourse || []

   useEffect(() => {
      if (sessions.length > 0 && !selectedSession) {
         setSelectedSession(sessions[0].objectId)
      }
   }, [sessions])

   const [enrollInCourse, { loading: enrollLoading }] = useMutation(ENROLL_MUTATION, { client })

   const isCreator = user?.objectId && course?.createdBy?.objectId === user.objectId
   const canAccess = isCreator || enrolled

   const handleRegister = async () => {
      if (!user) { router.push("/login"); return }
      try {
         await enrollInCourse({ variables: { courseId, userId: user.objectId } })
         setEnrolled(true)
      } catch (error) {
         console.error("Enrollment failed:", error)
      }
   }

   return {
      courseId,
      course,
      sessions,
      loading,
      enrolled,
      enrollLoading,
      canAccess,
      showFullDesc,
      setShowFullDesc,
      selectedSession,
      setSelectedSession,
      handleRegister,
      router,
   }
}
