"use client"

import { Suspense } from "react"
import Loading from "@/components/Loading"
import { AddCourseForm, useAddCourse } from "@/features/add-course"

const AddCourseContent = () => {
   const form = useAddCourse()
   return <AddCourseForm {...form} />
}

const AddCourse = () => (
   <Suspense fallback={<Loading />}>
      <AddCourseContent />
   </Suspense>
)

export default AddCourse
