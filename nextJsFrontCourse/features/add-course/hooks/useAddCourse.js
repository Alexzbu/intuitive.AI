"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@apollo/client"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "react-hot-toast"
import client from "@/utils/apolloClient"
import { addCourseSchema } from "../schemas/addCourseSchema"
import {
   ADD_COURSE_MUTATION,
   ADD_AI_ASSISTENT_HISTORY,
   GET_AI_ASSISTENT_HISTORY,
} from "../api/courseMutations"

export function useAddCourse() {
   const router = useRouter()
   const searchParams = useSearchParams()
   const noAI = searchParams.get("noai") === "true"

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
            router.push(`/add-section?id=${data.addCourse.objectId}`)
         }
      } catch (error) {
         toast.error("Failed to save!", { id: toastId })
         console.error("Error adding course:", error)
      }
   }

   return {
      // Form
      register,
      handleSubmit,
      setValue,
      control,
      errors,
      isSubmitting,
      onSubmit,
      // what_you_learn field array
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
   }
}
