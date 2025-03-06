"use client"

import { useState } from 'react'
import { gql, useMutation } from "@apollo/client"
import client from '@/utils/apolloClient'

const ADD_VIDEO_MUTATION = gql`
            mutation AddVideo($section_id: ID!, $name: String!, $question_type: String!, $video_name: String!, $video_link: String!) {
               addQuestion(section_id: $section_id, name: $name, question_type: $question_type, video_name: $video_name, video_link: $video_link) {
               objectId
               name
               }
            }`

const AddVideo = ({ sectionId, isVideo, setIsVideo }) => {
   const [title, setTitle] = useState('')
   const [link, setLink] = useState('')
   const [addQuestion] = useMutation(ADD_VIDEO_MUTATION, { client })


   const sendForm = async () => {

      try {
         const { data } = await addQuestion({
            variables: {
               section_id: sectionId,
               question_type: "Video",
               name: title,
               video_name: title,
               video_link: link
            },
         })
         setTitle('')
         setLink('')
         setIsVideo(false)
      } catch (error) {
         setErrors(error.response.data)
         console.error('Error adding section:', error)
      }
   }

   return (
      <>
         <div className={isVideo ? "form question-form visible" : "form question-form invisible"}>
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
               Add
            </button>
         </div >
      </>
   )
}

export default AddVideo
