"use client"

import { useState, Suspense } from 'react'
import { gql, useMutation } from "@apollo/client"
import client from '@/utils/apolloClient'
import { useRouter, useSearchParams } from "next/navigation"
import AddQuestions from '@/components/add-questions/add-questions'
import Loading from '@/components/Loading'

const ADD_SECTION_MUTATION = gql`
            mutation AddSection($course_id: ID!, $name: String!) {
               addSection(course_id: $course_id, name: $name) {
               objectId
               name
               }
            }`

const AddSectionContent = () => {
   const router = useRouter()
   const searchParams = useSearchParams();
   const courseId = searchParams.get("id")
   const [title, setTitle] = useState('')
   const [sections, setSections] = useState([])
   const [activeSection, setActiveSection] = useState(null)
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
         setActiveSection({ sectionId: data.addSection.objectId, sectionName: data.addSection.name })
      } catch (error) {
         setErrors(error.response?.data ?? {})
         console.error('Error adding section:', error)
      }
   }

   const finalizeSection = () => {
      setSections((prev) => [...prev, activeSection])
      setActiveSection(null)
   }

   return (
      <div className="container">
         {sections.map((section) => (
            <div key={section.sectionId} className="section-done">
               <h2 className="title">{section.sectionName} ✓</h2>
            </div>
         ))}

         {activeSection && (
            <>
               <AddQuestions sectionId={activeSection.sectionId} sectionName={activeSection.sectionName} />
               <button className="form__button" onClick={finalizeSection}>
                  Add another section
               </button>
            </>
         )}

         {!activeSection && (
            <div className="form">
               <h1 className="title">{sections.length > 0 ? "Add another module" : "Add new module"}</h1>
               <label className="form__label" htmlFor="title">Name of the module:</label>
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
         )}
      </div>
   );
};

const AddSection = () => (
   <Suspense fallback={<Loading />}>
      <AddSectionContent />
   </Suspense>
)
export default AddSection
