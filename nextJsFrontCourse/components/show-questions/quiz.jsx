"use client"

import { useState, useEffect } from 'react'
import { gql, useQuery } from "@apollo/client"
import client from '@/utils/apolloClient'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Link from 'next/link';

const GET_QUESTION_QUERY = gql`
   query getQuestion($id: ID!) {
      getQuestion(id: $id) {
         objectId
         quiz_name
         quiz_questions{
           edges{
             node{
               objectId
               name
               answer_explenetion
               answers{
                 edges{
                   node{
                     objectId
                     name
                     isCorrect
                   }
                 }
               }
             }
           }
         }
      }
   }`

const Quiz = ({ questionId }) => {
   const [questions, setQuestions] = useState([])
   const [answers, setAnswers] = useState([])

   const { data, loading } = useQuery(GET_QUESTION_QUERY, {
      client,
      variables: { id: questionId },
      skip: !questionId,
   })
   useEffect(() => {
      if (data?.getQuestion?.quiz_questions?.edges) {
         setQuestions(data.getQuestion.quiz_questions.edges)
         setAnswers(data.getQuestion.quiz_questions.edges)

      }
   }, [data])

   const checkCorrect = (objectId) => {
      alert(objectId)
   }

   return (
      <>
         <div className="question">
            <h2 className="slide-hero__title">{data?.getQuestion.quiz_name}</h2>
            <Swiper
               modules={[Navigation]}
               spaceBetween={0}
               slidesPerView={1}
               speed={800}
               navigation={{
                  prevEl: '.hero__arrow--prev',
                  nextEl: '.hero__arrow--next',
               }}
            >
               {questions.map((question) => (
                  <SwiperSlide key={question.node.objectId}>
                     <h2>{question.node.name}</h2>
                     <h2>{question.node.answer_explenetion}</h2>
                     {question.node.answers.edges.map((answer) => (
                        <div key={answer.node.objectId}>
                           <button className="question-box__item"
                              onClick={() => answer.node.isCorrect ? alert('correct') : alert('incorrect')}>
                              {answer.node.name}
                           </button>
                        </div>
                     ))}
                  </SwiperSlide>
               ))}
            </Swiper>
            <button className="hero__arrow--prev ">BACK</button>
            <button className="hero__arrow--next ">NEXT QUESTION</button>
         </div>
      </>
   );

}

export default Quiz
