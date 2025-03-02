"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { gql, useQuery } from "@apollo/client"
import client from "@/utils/apolloClient"
import Video from "@/components/show-questions/video"
import PDF from "@/components/show-questions/pdf-file"

const GET_COURSE_QUERY = gql`
   query getCourse($id: ID!) {
      getCourse(id: $id) {
         name
         description
         sections(order:createdAt_ASC) {
            edges {
               node {
                  objectId
                  name
                  questions(order:createdAt_ASC) {
                     edges {
                        node {
                           objectId
                           question_type
                           video_name
                           file_name
                        }
                     }
                  }
               }
            }
         }
      }
   }`

const Course = () => {
   const searchParams = useSearchParams()
   const courseId = searchParams.get("id")
   const [questionId, setQuestionId] = useState('')
   const [isVideo, setIsVideo] = useState(false)
   const [isFile, setIsFile] = useState(false)
   const [isQuiz, setIsQuiz] = useState(false)

   const { data: dataCourse, loading } = useQuery(GET_COURSE_QUERY, {
      client,
      variables: { id: courseId },
      skip: !courseId,
   })

   return (
      <div className="container">
         <div className="course">
            <h2>{dataCourse?.getCourse?.name}</h2>
            <p>{dataCourse?.getCourse?.description}</p>

            <div className="course__box">
               <div className="course__sections sections">
                  {dataCourse?.getCourse.sections.edges.map((section) => (
                     <div className="sections__item" key={section.node.objectId}>
                        <h2>{section.node.name}</h2>

                        <div className="questions">
                           {section.node.questions.edges.length > 0 ? (
                              section.node.questions.edges.map((question) => {
                                 switch (question.node.question_type) {
                                    case "Video":
                                       return (
                                          <div key={question.node.objectId}>
                                             <button
                                                className="question-box__item"
                                                onClick={() => {
                                                   setQuestionId(question.node.objectId);
                                                   setIsVideo((prev) => !prev);
                                                   setIsFile(false);
                                                   setIsQuiz(false);
                                                }}>
                                                {question.node.video_name}
                                             </button>
                                          </div>
                                       );

                                    case "File":
                                       return (
                                          <div key={question.node.objectId}>
                                             <button
                                                className="question-box__item"
                                                onClick={() => {
                                                   setQuestionId(question.node.objectId);
                                                   setIsFile((prev) => !prev);
                                                   setIsVideo(false);
                                                   setIsQuiz(false)
                                                }}>
                                                {question.node.file_name}
                                             </button>
                                          </div>
                                       );

                                    case "Quiz":
                                       return (
                                          <div key={question.node.objectId}>
                                             <button
                                                className="question-box__item"
                                                onClick={() => {
                                                   setQuestionId(question.node.objectId);
                                                   setIsQuiz((prev) => !prev);
                                                   setIsVideo(false);
                                                   setIsFile(false);
                                                }}>
                                                {question.node.quiz_name}
                                             </button>
                                          </div>
                                       );

                                    default:
                                       return null
                                 }
                              })
                           ) : (
                              <p>No questions available.</p>
                           )}
                        </div>
                     </div>
                  ))}
               </div>

               <div className="question-card">
                  {isVideo && <Video questionId={questionId} />}
                  {isFile && <PDF questionId={questionId} />}
                  {isQuiz && <Quiz questionId={questionId} />}
               </div>
            </div>
         </div>
      </div>
   )
}

export default Course
