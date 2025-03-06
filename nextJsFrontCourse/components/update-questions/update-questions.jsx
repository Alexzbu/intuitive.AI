"use client"

import { useState, useEffect } from 'react'
import AddVideo from '../add-questions/video-question'
import AddFile from '../add-questions/file-question'
import AddQuiz from '../add-questions/quiz-question'
import client from '@/utils/apolloClient'
import { gql, useMutation, useQuery } from "@apollo/client"
import UpdateVideo from './update-video-question'
import UpdatePDF from './update-pdf-question'

const GET_SECTIN_QUERY = gql`
            query getSection($id: ID!) {
               getSection(id: $id) {
                  objectId
                  name
                  questions{
                     edges{
                       node{
                         objectId
                         video_name
                         file_name
                         quiz_name
                        }
                     }
                  }
               }
            }`

const DEL_SECTION_MUTATION = gql`
            mutation delSection($id: ID!) {
               delSection(id: $id) {
               objectId
               name
               }
            }`



const UpdateQuestions = ({ sectionId, sectionName }) => {
   const [isVideo, setIsVideo] = useState(false)
   const [isUpVideo, setIsUpVideo] = useState(false)
   const [isFile, setIsFile] = useState(false)
   const [isUpFile, setIsUpFile] = useState(false)
   const [isQuiz, setIsQuiz] = useState(false)
   const [videoQuestions, setVideoQuestions] = useState([])
   const [pdfQuestions, setPdfQuestions] = useState([])
   const [quizQuestions, setQuizQuestions] = useState([])
   const [questionId, setQuestionId] = useState('')
   const [delSection, { loading: delLoading }] = useMutation(DEL_SECTION_MUTATION, { client })
   const { data: SectionData, loading, error, refetch } = useQuery(GET_SECTIN_QUERY, {
      client,
      variables: { id: sectionId },
      skip: !sectionId,
   })
   useEffect(() => {
      if (SectionData?.getSection?.questions?.edges) {
         SectionData.getSection.questions.edges.forEach((question) => {
            setVideoQuestions((prevSections) => [
               ...prevSections, { questionId: question.node.objectId, questionName: question.node.video_name }])
            setPdfQuestions((prevSections) => [
               ...prevSections, { questionId: question.node.objectId, questionName: question.node.file_name }])
            setQuizQuestions((prevSections) => [
               ...prevSections, { questionId: question.node.objectId, questionName: question.node.quiz_name }])
         })
      }
   }, [SectionData])
   const deleteSection = async (id) => {

      try {
         const { data } = await delSection({
            variables: {
               id: id
            },
         })
         window.location.reload()
      } catch (error) {
         console.error('Error deleting data:', error)
      }
   }


   return (
      <>
         {/* <h1 className="title">{sectionName}</h1> */}

         <input
            className="form__input title"
            type="text"
            id="title"
            name="title"
            value={sectionName ?? ""}
            onChange={(e) => setsectionName(e.target.value)}
         />
         <button className="course-card__link delete-button"
            onClick={() => deleteSection(sectionId)}
            disabled={delLoading}>Remove
         </button>
         {videoQuestions?.map((video) => (
            <button
               key={video.questionId}
               onClick={() => {
                  setIsUpVideo((prev) => !prev);
                  setQuestionId(video.questionId);
               }}
               className="question-box__item"
            >
               {video.questionName}
            </button>
         ))}

         {
            pdfQuestions?.map((pdf) => (
               <button
                  key={pdf.questionId}
                  onClick={() => {
                     setIsUpFile((prev) => !prev);
                     setQuestionId(pdf.questionId);
                  }}
                  className="question-box__item"
               >
                  {pdf.questionName}
               </button>
            ))
         }
         {
            quizQuestions?.map((quiz) => (
               <button className="question-box__item">{quiz.questionName}</button>
            ))
         }
         {isUpVideo && <UpdateVideo Id={questionId} isUpVideo={isUpVideo} setIsUpVideo={setIsUpVideo} />}
         {isUpFile && <UpdatePDF Id={questionId} isUpFile={isUpFile} setIsUpFile={setIsUpFile} />}

         <div className="question-box">
            <div className="question-box__items">
               <button onClick={() => setIsVideo((prev) => !prev)} className="question-box__item">Add Video question</button>
               <button onClick={() => setIsFile((prev) => !prev)} className="question-box__item">Add File question</button>
               <button onClick={() => setIsQuiz((prev) => !prev)} className="question-box__item">Add Quiz question</button>
            </div>
            {isVideo && <AddVideo sectionId={sectionId} isVideo={isVideo} setIsVideo={setIsVideo} />}
            {isFile && <AddFile sectionId={sectionId} isFile={isFile} setIsFile={setIsFile} />}
            {isQuiz && <AddQuiz sectionId={sectionId} isQuiz={isQuiz} setIsQuiz={setIsQuiz} />}
         </div>
      </>
   )
}

export default UpdateQuestions
