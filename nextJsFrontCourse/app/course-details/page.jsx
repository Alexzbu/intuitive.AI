"use client"

import { Suspense } from "react"
import { Center, Spinner } from "@chakra-ui/react"
import { CourseDetailsPage, useCourseDetails } from "@/features/course-details"

const CourseDetailsContent = () => {
   const props = useCourseDetails()
   if (props.loading) return <Center py="20"><Spinner size="xl" color="blue.500" /></Center>
   return <CourseDetailsPage {...props} />
}

const CourseDetails = () => (
   <Suspense fallback={<Center py="20"><Spinner size="xl" color="blue.500" /></Center>}>
      <CourseDetailsContent />
   </Suspense>
)

export default CourseDetails
