"use client"

import { useState, useEffect } from 'react'
import { gql, useMutation, useQuery } from "@apollo/client"
import client from '@/utils/apolloClient'

const GET_QUESTUON_QUERY = gql`
         query getQuestion($id: ID!) {
             getQuestion(id: $id) { 
              objectId
              video_name
              video_link
             }
         }`

const UP_VIDEO_MUTATION = gql`
            mutation upVideo($id: ID!, $name: String!, $video_name: String!, $video_link: String!) {
               upQuestion(id: $id, name: $name video_name: $video_name, video_link: $video_link) {
               objectId
               name
               }
            }`

const DEL_QUESTION_MUTATION = gql`
            mutation delQuestion($id: ID!) {
               delQuestion(id: $id) {
               objectId
               name
               }
            }`

const UpdateVideo = ({ Id, setIsUpVideo }) => {
   const [title, setTitle] = useState('')
   const [link, setLink] = useState('')
   const [upQuestion] = useMutation(UP_VIDEO_MUTATION, { client })
   const [delQuestion] = useMutation(DEL_QUESTION_MUTATION, { client })
   const { data, loading: delLoading, error, refetch } = useQuery(GET_QUESTUON_QUERY, {
      client,
      variables: { id: Id },
      skip: !Id,
   })
   useEffect(() => {
      if (data?.getQuestion?.video_name) {
         setTitle(data?.getQuestion?.video_name)
         setLink(data?.getQuestion?.video_link)
      }
   }, [data])

   const deleteQuestion = async (id) => {

      try {
         const { data } = await delQuestion({
            variables: {
               id: id
            },
         })
         window.location.reload()
      } catch (error) {
         console.error('Error deleting data:', error)
      }
   }

   const sendForm = async () => {

      try {
         const { data } = await upQuestion({
            variables: {
               id: Id,
               name: title,
               video_name: title,
               video_link: link
            },
         })
         setTitle('')
         setLink('')
         setIsUpVideo(false)
         window.location.reload()
      } catch (error) {
         setErrors(error.response.data)
         console.error('Error adding section:', error)
      }
   }

   return (
      <>
         <div className="form question-form visible">
            <label className="form__label" htmlFor="title">Name of the video:</label>
            <input
               className="form__input"
               type="text"
               id="title"
               name="title"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
            />

            <label className="form__label" htmlFor="link">Link of the vodeo:</label>
            <input
               className="form__input"
               type="text"
               id="link"
               name="link"
               value={link}
               onChange={(e) => setLink(e.target.value)}
            />

            <button className="form__button" onClick={sendForm}>
               Save
            </button>
            <button className="form__button"
               onClick={() => deleteQuestion(Id)}
               disabled={delLoading}>Remove
            </button>
         </div >
      </>
   )
}

export default UpdateVideo
