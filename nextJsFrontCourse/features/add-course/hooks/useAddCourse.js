"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { gql, useMutation, useQuery } from "@apollo/client"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "react-hot-toast"
import client from "@/utils/apolloClient"
import { addCourseSchema } from "../schemas/addCourseSchema"
import {
   ADD_COURSE_MUTATION,
   ADD_AI_ASSISTENT_HISTORY,
   GET_AI_ASSISTENT_HISTORY,
} from "../api/courseMutations"

const GET_SESSIONS_QUERY = gql`
   query getCourseSessionsByCourse($courseId: ID!) {
      getCourseSessionsByCourse(courseId: $courseId) {
         objectId start_date end_date schedule spots_available max_spots is_active
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
      delCourseSession(id: $id) { objectId }
   }`

export function useAddCourse() {
   const router = useRouter()
   const searchParams = useSearchParams()
   const noAI = searchParams.get("noai") === "true"

   const [createdCourseId, setCreatedCourseId] = useState(null)
   const [newSession, setNewSession] = useState({
      start_date: "", end_date: "", schedule: "", spots_available: "", max_spots: "",
   })

   const [user] = useState(() => {
      if (typeof window === "undefined") return null
      try {
         const stored = localStorage.getItem("user")
         return stored ? JSON.parse(stored) : null
      } catch {
         return null
      }
   })

   // AI chatbot panel state
   const [showAI, setShowAI] = useState(false)
   const [inputId, setInputId] = useState("")

   // AI history search state
   const [search, setSearch] = useState("")
   const [historyResults, setHistoryResults] = useState([])
   const [showHistoryResults, setShowHistoryResults] = useState(false)

   // AI history data for submission
   const [questionsHistory, setQuestionsHistory] = useState([])
   const [resObjectsHistory, setresObjectsHistory] = useState([])

   // Thumbnail state — separate from RHF so the preview always re-renders
   const [thumbnail, setThumbnail] = useState("")
   const [thumbnailUploading, setThumbnailUploading] = useState(false)

   const {
      register,
      handleSubmit,
      setValue,
      watch,
      control,
      formState: { errors, isSubmitting },
   } = useForm({
      resolver: zodResolver(addCourseSchema),
      defaultValues: {
         name: "",
         subtitle: "",
         objective: "",
         target_group: "",
         recommendation: "",
         key_words: [],
         description: "",
         contents: "",
         duration_hours: "",
         location: "",
         price: "",
         registration_deadline: "",
         what_you_learn: [],
         further_information: "",
         thumbnail: "",
      },
   })

   const { fields: learnFields, append: appendLearn, remove: removeLearn } = useFieldArray({
      control,
      name: "what_you_learn",
   })

   // Setters for Chatbot component (wraps setValue)
   const setTitle = (val) => setValue("name", val)
   const setSubtitle = (val) => setValue("subtitle", val)
   const setObjective = (val) => setValue("objective", val)
   const setTarget_group = (val) => setValue("target_group", val)
   const setRecommendation = (val) => setValue("recommendation", val)
   const setKey_words = (val) => setValue("key_words", Array.isArray(val) ? val : [val])
   const setDescription = (val) => setValue("description", val)

   const [addCourse] = useMutation(ADD_COURSE_MUTATION, { client })
   const [addAiAssistentHistory] = useMutation(ADD_AI_ASSISTENT_HISTORY, { client })
   const [fetchHistoryMutation] = useMutation(GET_AI_ASSISTENT_HISTORY, { client })
   const [addCourseSession, { loading: addingSession }] = useMutation(ADD_SESSION_MUTATION, { client })
   const [delCourseSession] = useMutation(DEL_SESSION_MUTATION, { client })

   const { data: sessionsData, refetch: refetchSessions } = useQuery(GET_SESSIONS_QUERY, {
      client,
      variables: { courseId: createdCourseId },
      skip: !createdCourseId,
   })

   // Fetch AI history when search changes
   useEffect(() => {
      if (!search) {
         setHistoryResults([])
         setShowHistoryResults(false)
         return
      }
      const fetchAiHistory = async () => {
         try {
            const { data } = await fetchHistoryMutation({ variables: { prompt: search } })
            const results = data?.getAiAssistentHistory || []
            setHistoryResults(results)
            setShowHistoryResults(results.length > 0)
         } catch (err) {
            console.error("Error fetching AI history:", err)
         }
      }
      fetchAiHistory()
   }, [search])

   const fillFromHistory = (index) => {
      const item = historyResults[index]
      if (!item?.response) return
      const fieldSetters = [setTitle, setSubtitle, setObjective, setTarget_group, setRecommendation, setKey_words, setDescription]
      item.response.forEach((r, i) => {
         if (fieldSetters[i]) fieldSetters[i](r.content)
      })
      setSearch("")
      setShowHistoryResults(false)
   }

   const handleThumbnailUpload = (e) => {
      const file = e.target.files?.[0]
      if (!file) return
      setThumbnailUploading(true)
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
         const dataUrl = reader.result
         setThumbnail(dataUrl)
         setValue("thumbnail", dataUrl)
         setThumbnailUploading(false)
      }
      reader.onerror = () => {
         toast.error("Image upload failed")
         setThumbnailUploading(false)
      }
   }

   // Keep thumbnail state in sync when URL is typed manually
   const handleThumbnailUrlChange = (e) => {
      const url = e.target.value
      setThumbnail(url)
      setValue("thumbnail", url)
   }

   const clearThumbnail = () => {
      setThumbnail("")
      setValue("thumbnail", "")
   }

   const onSubmit = async (formData) => {
      const toastId = toast.loading("Saving...", {
         position: "bottom-center",
         style: { background: "green", color: "white", width: "100%", maxWidth: "900px" },
      })
      try {
         const coursePayload = {
            name: formData.name,
            subtitle: formData.subtitle,
            objective: formData.objective,
            target_group: formData.target_group,
            recommendation: formData.recommendation,
            key_words: formData.key_words,
            description: formData.description,
            contents: formData.contents,
            duration_hours: formData.duration_hours,
            location: formData.location,
            price: formData.price,
            registration_deadline: formData.registration_deadline,
            what_you_learn: formData.what_you_learn?.map(item => item.value) ?? [],
            further_information: formData.further_information,
            thumbnail: formData.thumbnail,
         }

         const { data } = await addCourse({
            variables: {
               course: coursePayload,
               creatorId: user?.objectId ?? null,
            },
         })

         if (questionsHistory.length > 0) {
            await addAiAssistentHistory({
               variables: {
                  course_id: data.addCourse.objectId,
                  questionsHistory: questionsHistory[0],
                  resObjectsHistory: resObjectsHistory[resObjectsHistory.length - 1],
               },
            })
         }

         toast.success("Saved successfully!", {
            id: toastId,
            duration: 3000,
            position: "bottom-center",
            style: { background: "green", color: "white", width: "100%", maxWidth: "900px" },
         })

         if (data.addCourse.objectId) {
            setCreatedCourseId(data.addCourse.objectId)
         }
      } catch (error) {
         toast.error("Failed to save!", { id: toastId })
         console.error("Error adding course:", error)
      }
   }

   const handleAddSession = async () => {
      if (!createdCourseId) return
      try {
         await addCourseSession({
            variables: {
               courseId: createdCourseId,
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

   // Controlled interface for CourseFormFields
   const watchedValues = watch()
   const fields = {
      name: watchedValues.name,
      subtitle: watchedValues.subtitle,
      objective: watchedValues.objective,
      target_group: watchedValues.target_group,
      description: watchedValues.description,
      recommendation: watchedValues.recommendation,
      key_words: watchedValues.key_words?.[0] ?? "",
      contents: watchedValues.contents,
      duration_hours: watchedValues.duration_hours,
      location: watchedValues.location,
      price: watchedValues.price,
      registration_deadline: watchedValues.registration_deadline,
      further_information: watchedValues.further_information,
   }

   const handleChange = (fieldName, value) => {
      if (fieldName === "key_words") {
         setValue("key_words", [value])
      } else {
         setValue(fieldName, value)
      }
   }

   const learnItems = (watchedValues.what_you_learn ?? []).map(item => item?.value ?? "")
   const onLearnAdd = () => appendLearn({ value: "" })
   const onLearnUpdate = (i, val) => setValue(`what_you_learn.${i}.value`, val)
   const onLearnRemove = (i) => removeLearn(i)

   return {
      // Form
      register,
      handleSubmit,
      setValue,
      control,
      errors,
      isSubmitting,
      onSubmit,
      // Controlled interface for CourseFormFields
      fields,
      handleChange,
      learnItems,
      onLearnAdd,
      onLearnUpdate,
      onLearnRemove,
      // what_you_learn field array (legacy, still used internally)
      learnFields,
      appendLearn,
      removeLearn,
      // thumbnail
      thumbnail,
      thumbnailUploading,
      handleThumbnailUpload,
      handleThumbnailUrlChange,
      clearThumbnail,
      // AI chatbot
      noAI,
      showAI,
      setShowAI,
      inputId,
      setInputId,
      setTitle,
      setSubtitle,
      setObjective,
      setTarget_group,
      setRecommendation,
      setKey_words,
      setDescription,
      questionsHistory,
      setQuestionsHistory,
      resObjectsHistory,
      setresObjectsHistory,
      // AI history search
      search,
      setSearch,
      historyResults,
      showHistoryResults,
      fillFromHistory,
      // Post-creation session management
      router,
      createdCourseId,
      sessions: sessionsData?.getCourseSessionsByCourse ?? [],
      newSession,
      setNewSession,
      addingSession,
      handleAddSession,
      handleDeleteSession,
   }
}
