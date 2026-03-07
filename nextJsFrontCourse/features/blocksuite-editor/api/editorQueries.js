import { gql } from "@apollo/client"

export const GET_EDITOR_DOC = gql`
  query GetEditorDoc($courseId: String!) {
    getEditorDoc(courseId: $courseId) {
      objectId
      courseId
      content
    }
  }
`

export const SAVE_EDITOR_DOC = gql`
  mutation SaveEditorDoc($courseId: String!, $content: String!) {
    saveEditorDoc(courseId: $courseId, content: $content) {
      objectId
      courseId
    }
  }
`
