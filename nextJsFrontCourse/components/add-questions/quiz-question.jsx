"use client"

import { useState } from 'react'
import { gql, useMutation } from "@apollo/client"
import client from '@/utils/apolloClient'

const ADD_QUIZ_MUTATION = gql`
            mutation AddQuiz($section_id: ID!, $name: String!, $question_type: String!, $quiz_name: String!) {
               addQuestion(section_id: $section_id, name: $name, question_type: $question_type, quiz_name: $quiz_name) {
               objectId
               quiz_name
               }
            }`
const ADD_QUIZ_QUESTION_MUTATION = gql`
            mutation AddQuiz($question_id: ID!, $name: String!, $answer_explenetion: String!) {
               addQuiz_Question(question_id: $question_id, name: $name, answer_explenetion: $answer_explenetion) {
               objectId
               name
               }
            }`
const ADD_ANSWER_MUTATION = gql`
            mutation AddAnswer($quiz_question_id: ID!, $name: String!, $isCorrect: Boolean!) {
               addAnswer(quiz_question_id: $quiz_question_id, name: $name, isCorrect: $isCorrect) {
               objectId
               name
               }
            }`

const AddQuiz = ({ sectionId, setIsQuiz }) => {
   const [title, setTitle] = useState('')
   const [quizQuestion, setQuizQuestion] = useState('')
   const [quizQuestions, setQuizQuestions] = useState([])
   const [answer, setAnswer] = useState('')
   const [isCorrect, setIsCorrect] = useState(false)
   const [answers, setAnswers] = useState([])
   const [answerExplanation, setAnswerExplanation] = useState('')
   const [addQuiz] = useMutation(ADD_QUIZ_MUTATION, { client })
   const [addQuizQuestion] = useMutation(ADD_QUIZ_QUESTION_MUTATION, { client })
   const [addAnswer] = useMutation(ADD_ANSWER_MUTATION, { client })

   const saveAnswer = async () => {
      setAnswers((prevAnswers) => [
         ...prevAnswers, { answer: answer, isCorrect: isCorrect }
      ]);
      setAnswer('')
      setIsCorrect(false)
   }
   const saveQuestion = async () => {
      setQuizQuestions((prevQuestions) => [
         ...prevQuestions, { question: quizQuestion, answerExplanation: answerExplanation, answers: answers }
      ]);
      setQuizQuestion('')
      setAnswerExplanation('')
      setAnswers([])
   }

   const sendForm = async () => {
      try {
         const { data: QuizData } = await addQuiz({
            variables: {
               section_id: sectionId,
               question_type: "Quiz",
               name: title,
               quiz_name: title,
            },
         })
         await Promise.all(
            quizQuestions.map(async (question, index) => {
               const { data } = await addQuizQuestion({
                  variables: {
                     question_id: QuizData.addQuestion.objectId,
                     name: question.question,
                     quiz_name: question.question,
                     answer_explenetion: question.answerExplanation,
                  },
               })
               quizQuestions[index].answers.map(async (answer) => {
                  await addAnswer({
                     variables: {
                        quiz_question_id: data.addQuiz_Question.objectId,
                        name: answer.answer,
                        isCorrect: answer.isCorrect,
                     },
                  })
               })
            })
         )
         setTitle('')
         setQuizQuestions([])
         setIsQuiz(false)
      } catch (error) {
         // setErrors(error.response.data)
         console.error('Error adding section:', error)
      }
   }

   return (
      <>
         <div className="form question-form visible">
            <label className="form__label" htmlFor="title">Name of the Quiz:</label>
            <input
               className="form__input"
               type="text"
               id="title"
               name="title"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
            />

            <label className="form__label" htmlFor="quiz-question">Quiz question:</label>
            <input
               className="form__input"
               type="text"
               id="quiz-question"
               name="quiz-question"
               value={quizQuestion}
               onChange={(e) => setQuizQuestion(e.target.value)}
            />

            <div className="form">
               <div className="form">
                  <label className="form__label" htmlFor="answer">Answer:</label>
                  <textarea
                     className="form__input"
                     type="text"
                     id="answer"
                     name="answer"
                     value={answer}
                     onChange={(e) => setAnswer(e.target.value)}
                  ></textarea>
                  <div className='is-correct'>
                     <label className="form__label" htmlFor="isCorrect">Is correct:</label>
                     <input
                        className="form__input"
                        type="checkbox"
                        id="isCorrect"
                        name="isCorrect"
                        checked={isCorrect}
                        value={isCorrect}
                        onChange={(e) => setIsCorrect((prev) => !prev)}
                     />
                  </div>
                  <button className="form__button" onClick={saveAnswer}>
                     Save answer
                  </button>
               </div>
               <label className="form__label" htmlFor="answer-explanation">Answer explanation:</label>
               <input
                  className="form__input"
                  type="text"
                  id="answer-explanation"
                  name="answer-explanation"
                  value={answerExplanation}
                  onChange={(e) => setAnswerExplanation(e.target.value)}
               />
               <button className="form__button" onClick={saveQuestion}>
                  Save question
               </button>
            </div>
            <button className="form__button" onClick={sendForm}>
               Add Quiz
            </button>
         </div >
      </>
   )
}

export default AddQuiz
