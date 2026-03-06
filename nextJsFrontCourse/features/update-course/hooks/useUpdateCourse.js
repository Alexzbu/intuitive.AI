"use client"

import { useState, useEffect, useCallback } from "react"
import { gql, useMutation, useQuery } from "@apollo/client"
import client from "@/utils/apolloClient"
import { useSearchParams, useRouter } from "next/navigation"

const UP_COURSE_MUTATION = gql`
   mutation upCourse(
      $id: ID!, $name: String!, $subtitle: String, $objective: String,
      $target_group: String, $description: String, $recommendation: String,
      $contents: String, $duration_hours: String, $location: String, $price: String,
      $registration_deadline: String, $what_you_learn: [String],
      $further_information: String, $thumbnail: String
   ) {
      upCourse(
         id: $id, name: $name, subtitle: $subtitle, objective: $objective,
         target_group: $target_group, description: $description, recommendation: $recommendation,
         contents: $contents, duration_hours: $duration_hours, location: $location, price: $price,
         registration_deadline: $registration_deadline, what_you_learn: $what_you_learn,
         further_information: $further_information, thumbnail: $thumbnail
      ) {
         objectId
         name
      }
   }`

const GET_SESSIONS_QUERY = gql`
   query getCourseSessionsByCourse($courseId: ID!) {
      getCourseSessionsByCourse(courseId: $courseId) {
         objectId
         start_date
         end_date
         schedule
         spots_available
         max_spots
         is_active
      }
   }`

const ADD_SESSION_MUTATION = gql`
   mutation addCourseSession($courseId: ID!, $start_date: String, $end_date: String, $schedule: String, $spots_available: Int, $max_spots: Int) {
      addCourseSession(courseId: $courseId, start_date: $start_date, end_date: $end_date, schedule: $schedule, spots_available: $spots_available, max_spots: $max_spots) {
         objectId
      }
   }`

const DEL_SESSION_MUTATION = gql`
   mutation delCourseSession($id: ID!) {
      delCourseSession(id: $id) {
         objectId
      }
   }`

export function useUpdateCourse() {
   const router = useRouter()
   const searchParams = useSearchParams()
   const courseId = searchParams.get("id")

   const [name, setName] = useState("")
   const [subtitle, setSubtitle] = useState("")
   const [objective, setObjective] = useState("")
   const [target_group, setTargetGroup] = useState("")
   const [description, setDescription] = useState("")
   const [recommendation, setRecommendation] = useState("")
   const [contents, setContents] = useState("")
   const [duration_hours, setDurationHours] = useState("")
   const [location, setLocation] = useState("")
   const [price, setPrice] = useState("")
   const [registration_deadline, setRegistrationDeadline] = useState("")
   const [what_you_learn, setWhatYouLearn] = useState([])
   const [further_information, setFurtherInformation] = useState("")
   const [thumbnail, setThumbnail] = useState("")
   const [thumbnailUploading, setThumbnailUploading] = useState(false)
   const [saveSuccess, setSaveSuccess] = useState(false)
   const [loading, setLoading] = useState(false)

   const [newSession, setNewSession] = useState({
      start_date: "", end_date: "", schedule: "", spots_available: "", max_spots: "",
   })

   const fetchCourse = useCallback(async () => {
      if (!courseId) return
      setLoading(true)
      try {
         const res = await fetch(
            `${process.env.NEXT_PUBLIC_SOCKET_URL}/parse/classes/Course/${courseId}`,
            { headers: {
               "X-Parse-Application-Id": process.env.NEXT_PUBLIC_PARSE_APP_ID,
               "X-Parse-Master-Key": process.env.NEXT_PUBLIC_PARSE_MASTER_KEY,
            }}
         )
         const c = await res.json()
         setName(c.name ?? "")
         setSubtitle(c.subtitle ?? "")
         setObjective(c.objective ?? "")
         setTargetGroup(c.target_group ?? "")
         setDescription(c.description ?? "")
         setRecommendation(c.recommendation ?? "")
         setContents(c.contents ?? "")
         setDurationHours(c.duration_hours ?? "")
         setLocation(c.location ?? "")
         setPrice(c.price ?? "")
         setRegistrationDeadline(c.registration_deadline ?? "")
         setWhatYouLearn(c.what_you_learn ?? [])
         setFurtherInformation(c.further_information ?? "")
         setThumbnail(c.thumbnail ?? "")
      } catch (err) {
         console.error("Failed to fetch course:", err)
      } finally {
         setLoading(false)
      }
   }, [courseId])

   useEffect(() => { fetchCourse() }, [fetchCourse])

   const { data: sessionsData, refetch: refetchSessions } = useQuery(GET_SESSIONS_QUERY, {
      client,
      variables: { courseId },
      skip: !courseId,
   })

   const [upCourse, { loading: saving }] = useMutation(UP_COURSE_MUTATION, { client })
   const [addCourseSession, { loading: addingSession }] = useMutation(ADD_SESSION_MUTATION, { client })
   const [delCourseSession] = useMutation(DEL_SESSION_MUTATION, { client })

   const setterMap = {
      name: setName,
      subtitle: setSubtitle,
      objective: setObjective,
      target_group: setTargetGroup,
      description: setDescription,
      recommendation: setRecommendation,
      contents: setContents,
      duration_hours: setDurationHours,
      location: setLocation,
      price: setPrice,
      registration_deadline: setRegistrationDeadline,
      further_information: setFurtherInformation,
   }

   const handleChange = (fieldName, value) => {
      setterMap[fieldName]?.(value)
   }

   const handleThumbnailUpload = (e) => {
      const file = e.target.files[0]
      if (!file) return
      setThumbnailUploading(true)
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
         setThumbnail(reader.result)
         setThumbnailUploading(false)
      }
      reader.onerror = () => {
         console.error("Image read failed")
         setThumbnailUploading(false)
      }
   }

   const handleThumbnailUrlChange = (e) => setThumbnail(e.target.value)
   const clearThumbnail = () => setThumbnail("")

   const handleSave = async () => {
      try {
         await upCourse({
            variables: {
               id: courseId, name, subtitle, objective, target_group, description,
               recommendation, contents, duration_hours, location, price,
               registration_deadline, what_you_learn, further_information, thumbnail,
            },
         })
         setSaveSuccess(true)
         setTimeout(() => setSaveSuccess(false), 3000)
      } catch (error) {
         console.error("Error updating course:", error)
      }
   }

   const onLearnAdd = () => setWhatYouLearn([...what_you_learn, ""])
   const onLearnUpdate = (i, val) => {
      const arr = [...what_you_learn]
      arr[i] = val
      setWhatYouLearn(arr)
   }
   const onLearnRemove = (i) => setWhatYouLearn(what_you_learn.filter((_, idx) => idx !== i))

   const handleAddSession = async () => {
      try {
         await addCourseSession({
            variables: {
               courseId,
               start_date: newSession.start_date,
               end_date: newSession.end_date,
               schedule: newSession.schedule,
               spots_available: newSession.spots_available ? parseInt(newSession.spots_available) : null,
               max_spots: newSession.max_spots ? parseInt(newSession.max_spots) : null,
            }
         })
         setNewSession({ start_date: "", end_date: "", schedule: "", spots_available: "", max_spots: "" })
         refetchSessions()
      } catch (err) {
         console.error("Failed to add session:", err)
      }
   }

   const handleDeleteSession = async (id) => {
      try {
         await delCourseSession({ variables: { id } })
         refetchSessions()
      } catch (err) {
         console.error("Failed to delete session:", err)
      }
   }

   return {
      courseId,
      router,
      loading,
      fields: { name, subtitle, objective, target_group, description, recommendation, contents, duration_hours, location, price, registration_deadline, further_information },
      handleChange,
      thumbnail,
      thumbnailUploading,
      handleThumbnailUpload,
      handleThumbnailUrlChange,
      clearThumbnail,
      learnItems: what_you_learn,
      onLearnAdd,
      onLearnUpdate,
      onLearnRemove,
      saving,
      saveSuccess,
      handleSave,
      sessions: sessionsData?.getCourseSessionsByCourse ?? [],
      newSession,
      setNewSession,
      addingSession,
      handleAddSession,
      handleDeleteSession,
   }
}
