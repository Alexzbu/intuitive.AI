import { useState } from 'react'
import { gql, useQuery } from "@apollo/client"
import client from '@/utils/apolloClient'

const GET_QUESTION_QUERY = gql`
   query getQuestion($id: ID!) {
      getQuestion(id: $id) {
         video_link
      }
   }`

const Video = ({ questionId }) => {

   const { data, loading } = useQuery(GET_QUESTION_QUERY, {
      client,
      variables: { id: questionId },
      skip: !questionId,
   })


   return (
      <>
         <div className="question">
            <iframe className="question__video"
               src={data?.getQuestion.video_link} title="YouTube video player"
               frameBorder="0"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
               allowFullScreen>
            </iframe>
         </div >
      </>
   )
}

export default Video
