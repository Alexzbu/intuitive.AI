"use client"

import { Suspense } from "react"
import Loading from "@/components/Loading"
import { UpdateCourseForm, useUpdateCourse } from "@/features/update-course"

const UpdateCourseContent = () => {
   const form = useUpdateCourse()
   if (form.loading) return <Loading />
   return <UpdateCourseForm {...form} />
}

const UpdateCourse = () => (
   <Suspense fallback={<Loading />}>
      <UpdateCourseContent />
   </Suspense>
)

export default UpdateCourse
