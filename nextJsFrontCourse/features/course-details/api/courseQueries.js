import { gql } from "@apollo/client"

export const GET_SESSIONS_QUERY = gql`
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

export const IS_ENROLLED_QUERY = gql`
   query isEnrolledInCourse($courseId: ID!, $userId: ID!) {
      isEnrolledInCourse(courseId: $courseId, userId: $userId)
   }`

export const ENROLL_MUTATION = gql`
   mutation enrollInCourse($courseId: ID!, $userId: ID!) {
      enrollInCourse(courseId: $courseId, userId: $userId)
   }`
