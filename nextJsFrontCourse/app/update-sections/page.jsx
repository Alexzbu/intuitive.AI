"use client"

import { useState, useEffect } from 'react'
import { gql, useMutation, useQuery } from "@apollo/client"
import client from '@/utils/apolloClient'
import { useRouter, useSearchParams } from "next/navigation"
import UpdateQuestions from '@/components/update-questions/update-questions'

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
                           quiz_name
                        }
                     }
                  }
               }
            }
         }
      }
   }`

const ADD_SECTION_MUTATION = gql`
            mutation AddSection($course_id: ID!, $name: String!) {
               addSection(course_id: $course_id, name: $name) {
               objectId
               name
               }
            }`

const UP_SECTION_MUTATION = gql`
            mutation UpSection($id: ID!, $course_id: ID!, $name: String!) {
               upSection(id: $id, name: $name) {
               objectId
               name
               }
            }`

const UpdateSection = () => {
   const router = useRouter()
   const searchParams = useSearchParams();
   const courseId = searchParams.get("id")
   const [title, setTitle] = useState('')
   const [sectionName, setsectionName] = useState('')
   const [sections, setSections] = useState([])
   const [errors, setErrors] = useState({})
   const [upSection] = useMutation(UP_SECTION_MUTATION, { client })
   const [addSection] = useMutation(ADD_SECTION_MUTATION, { client })

   const { data: CourseData, loading, error, refetch } = useQuery(GET_COURSE_QUERY, {
      client,
      variables: { id: courseId },
      skip: !courseId,
   })
   useEffect(() => {
      if (CourseData?.getCourse?.sections?.edges) {
         CourseData.getCourse.sections.edges.forEach((section) => {
            setSections((prevSections) => [
               ...prevSections, { sectionId: section.node.objectId, sectionName: section.node.name }])
         })
      }
   }, [CourseData])

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
            < UpdateQuestions sectionId={section.sectionId} sectionName={section.sectionName} key={section.sectionId} />
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

export default UpdateSection
