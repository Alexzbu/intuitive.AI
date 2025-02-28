"use client"

import { useState } from 'react'
import { gql, useMutation } from "@apollo/client"
import client from '@/utils/apolloClient'
import { useRouter } from "next/navigation"

const ADD_COURSE_MUTATION = gql`
            mutation AddCourse($name: String!, $subtitle: String!, $description: String!) {
               addCourse(name: $name, subtitle: $subtitle, description: $description) {
               objectId
               name
               }
            }`

const AddCourse = () => {
   const router = useRouter()
   const [title, setTitle] = useState('')
   const [subtitle, setSubtitle] = useState('')
   const [description, setDescription] = useState('')
   const [errors, setErrors] = useState({})
   const [addCourse] = useMutation(ADD_COURSE_MUTATION, { client })
   // const navigate = useNavigate()

   // useEffect(() => {
   //    const getLocation = async () => {
   //       try {
   //          const response = await apiServer.get(`/locations/${id}`)
   //          if (response.status === 200) {
   //             setTitle(response.data.course.title)
   //             setAddress(response.data.course.address)
   //          }
   //       } catch (error) {
   //          console.error('Error:', error)
   //       }
   //    }
   //    getLocation()
   // }, [])

   // const validateForm = () => {
   //    const newErrors = {}

   //    if (!title.trim()) {
   //       newErrors.title = 'Name is required.'
   //    }
   //    if (title.length < 2 || title.length > 20) {
   //       newErrors.title = 'Name of the course should be from 2 to 20 characters.'
   //    }

   //    if (!address.trim()) {
   //       newErrors.address = 'Address is required.'
   //    }

   //    if (address.length < 3 || address.length > 50) {
   //       newErrors.address = 'Address must be from 3 to 50 characters'
   //    }

   //    setErrors(newErrors)

   //    return Object.keys(newErrors).length === 0
   // }

   const sendForm = async () => {
      // if (!validateForm()) {
      //    return
      // }

      try {
         const { data } = await addCourse({
            variables: {
               name: title,
               subtitle: subtitle,
               description: description,
            },
         })

         console.log("Course added:", data.addCourse)

         if (data.addCourse.objectId) {
            router.push(`/add-section?id=${data.addCourse.objectId}`)
         }
      } catch (error) {
         setErrors(error.response.data)
         console.error('Error adding course:', error)
      }
   };

   return (
      <div className="container">
         <h1 className="title">Add new course</h1>
         <div className="form">
            <label className="form__label" htmlFor="title">Name of the course:</label>
            <input
               className="form__input"
               type="text"
               id="title"
               name="title"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <span className="error">{errors.title}</span>}

            <label className="form__label" htmlFor="subtitle">Subtitle:</label>
            <input
               className="form__input"
               type="text"
               id="subtitle"
               name="subtitle"
               value={subtitle}
               onChange={(e) => setSubtitle(e.target.value)}
            />
            {errors.subtitle && <span className="error">{errors.subtitle}</span>}


            <label className="form__label" htmlFor="description">Description:</label>
            <textarea
               className="form__textarea"
               id="description"
               name="description"
               value={description}
               onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            {errors.description && <span className="error">{errors.description}</span>}

            <button className="form__button" onClick={sendForm}>
               Add
            </button>
         </div>
      </div>
   );
};

export default AddCourse
