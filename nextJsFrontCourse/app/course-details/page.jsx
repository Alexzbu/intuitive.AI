"use client"

import { Suspense } from "react"
import Loading from "@/components/Loading"
import { CourseDetailsPage, useCourseDetails } from "@/features/course-details"

const CourseDetailsContent = () => {
   const props = useCourseDetails()
   if (props.loading) return <Loading />
   return <CourseDetailsPage {...props} />
}

const CourseDetails = () => (
   <Suspense fallback={<Loading />}>
      <CourseDetailsContent />
   </Suspense>
)

export default CourseDetails
