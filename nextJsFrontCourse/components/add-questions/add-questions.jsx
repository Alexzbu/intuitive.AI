"use client"

import { useState } from 'react'
import AddVideo from './video-question'
import AddFile from './file-question'
import AddQuiz from './quiz-question'

const AddQuestions = ({ sectionId, sectionName }) => {
   const [isVideo, setIsVideo] = useState(false)
   const [isFile, setIsFile] = useState(false)
   const [isQuiz, setIsQuiz] = useState(false)

   return (
      <>
         <h1 className="title">{sectionName}</h1>
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

export default AddQuestions
