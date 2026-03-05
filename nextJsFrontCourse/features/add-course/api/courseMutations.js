import { gql } from "@apollo/client"

export const ADD_COURSE_MUTATION = gql`
   mutation AddCourse($course: Object, $creatorId: ID) {
      addCourse(course: $course, creatorId: $creatorId) {
         objectId
         name
      }
   }`

export const ADD_AI_ASSISTENT_HISTORY = gql`
   mutation addAiAssistentHistory($course_id: ID, $questionsHistory: String, $resObjectsHistory: [Object]) {
      addAiAssistentHistory(course_id: $course_id, questionsHistory: $questionsHistory, resObjectsHistory: $resObjectsHistory)
   }`

export const GET_AI_ASSISTENT_HISTORY = gql`
   mutation getAiAssistentHistory($prompt: String!) {
      getAiAssistentHistory(prompt: $prompt) {
         objectId
         request
         response {
            name
            content
         }
      }
   }`
