"use client"

import { useState } from 'react'
import { gql, useMutation } from "@apollo/client"
import client from '@/utils/apolloClient'
import { useRouter, useSearchParams } from "next/navigation"
import AddQuestions from '@/components/add-questions/add-questions'

const ADD_SECTION_MUTATION = gql`
            mutation AddSection($course_id: ID!, $name: String!) {
               addSection(course_id: $course_id, name: $name) {
               objectId
               name
               }
            }`

const AddSection = () => {
   const router = useRouter()
   const searchParams = useSearchParams();
   const courseId = searchParams.get("id")
   const [title, setTitle] = useState('')
   const [sections, setSections] = useState([])
   const [errors, setErrors] = useState({})
   const [addSection] = useMutation(ADD_SECTION_MUTATION, { client })

   const sendForm = async () => {

      try {
         const { data } = await addSection({
            variables: {
               course_id: courseId,
               name: title,
            },
         })
         setTitle('')
         setSections((prevSections) => [
            ...prevSections,
            { sectionId: data.addSection.objectId, sectionName: data.addSection.name },
         ])
      } catch (error) {
         setErrors(error.response.data)
         console.error('Error adding section:', error)
      }
   }

   return (
      <div className="container">
         {sections?.map((section) => (
            <AddQuestions sectionId={section.sectionId} sectionName={section.sectionName} key={section.sectionId} />
         ))}
         <h1 className="title">{sections.length > 0 ? "Add another section" : "Add new section"}</h1>
         <div className="form">
            <label className="form__label" htmlFor="title">Name of the section:</label>
            <input
               className="form__input"
               type="text"
               id="title"
               name="title"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <span className="error">{errors.title}</span>}

            <button className="form__button" onClick={sendForm}>
               Add
            </button>
         </div>
      </div>
   );
};

export default AddSection
