"use client"

import { useState, useEffect } from 'react'
import { gql, useMutation, useQuery } from "@apollo/client"
import client from '@/utils/apolloClient'
import { useRouter, useSearchParams } from "next/navigation"

const GET_COURSE_QUERY = gql`
         query getCourse($id: ID!) {
             getCourse(id: $id) {
               objectId
               name
               subtitle
               description 
            }
         }`

const UP_COURSE_MUTATION = gql`
            mutation upCourse($id: ID!, $name: String!, $subtitle: String!, $description: String!) {
               upCourse(id: $id, name: $name, subtitle: $subtitle, description: $description) {
               objectId
               name
               subtitle
               description
               }
            }`

const UpdateCourse = () => {
   const router = useRouter()
   const [title, setTitle] = useState('')
   const [subtitle, setSubtitle] = useState('')
   const [description, setDescription] = useState('')
   const [errors, setErrors] = useState({})
   const [upCourse] = useMutation(UP_COURSE_MUTATION, { client })
   const searchParams = useSearchParams();
   const courseId = searchParams.get("id")
   const { data: CourseData, loading, error, refetch } = useQuery(GET_COURSE_QUERY, {
      client,
      variables: { id: courseId },
      skip: !courseId,
   })
   useEffect(() => {
      setTitle(CourseData?.getCourse.name)
      setSubtitle(CourseData?.getCourse.subtitle)
      setDescription(CourseData?.getCourse.description)

      refetch()
   }, [CourseData])
   const sendForm = async () => {

      try {
         const { data } = await upCourse({
            variables: {
               id: courseId,
               name: title,
               subtitle: subtitle,
               description: description,
            },
         })
         alert('successful')

      } catch (error) {
         // setErrors(error.response.data)
         console.error('Error adding course:', error)
      }
   };

   return (
      <div className="container">
         <h1 className="title">Update course</h1>
         <div className="form">
            <label className="form__label" htmlFor="title">Name of the course:</label>
            <input
               className="form__input"
               type="text"
               id="title"
               name="title"
               value={title ?? ""}
               onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <span className="error">{errors.title}</span>}

            <label className="form__label" htmlFor="subtitle">Subtitle:</label>
            <input
               className="form__input"
               type="text"
               id="subtitle"
               name="subtitle"
               value={subtitle ?? ""}
               onChange={(e) => setSubtitle(e.target.value)}
            />
            {errors.subtitle && <span className="error">{errors.subtitle}</span>}


            <label className="form__label" htmlFor="description">Description:</label>
            <textarea
               className="form__textarea"
               id="description"
               name="description"
               value={description ?? ""}
               onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            {errors.description && <span className="error">{errors.description}</span>}

            <button className="form__button" onClick={sendForm}>
               Save
            </button>
            <button className="form__button" onClick={() => router.push(`/update-sections?id=${CourseData?.getCourse.objectId}`)}>
               Edit Sections
            </button>
         </div>
      </div>
   );
};

export default UpdateCourse
