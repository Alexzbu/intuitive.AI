"use client"

import { Suspense } from "react"
import { Center, Spinner } from "@chakra-ui/react"
import { UpdateCourseForm, useUpdateCourse } from "@/features/update-course"

const UpdateCourseContent = () => {
   const form = useUpdateCourse()
   if (form.loading) return <Center py="20"><Spinner size="xl" color="blue.500" /></Center>
   return <UpdateCourseForm {...form} />
}

const UpdateCourse = () => (
   <Suspense fallback={<Center py="20"><Spinner size="xl" color="blue.500" /></Center>}>
      <UpdateCourseContent />
   </Suspense>
)

export default UpdateCourse
