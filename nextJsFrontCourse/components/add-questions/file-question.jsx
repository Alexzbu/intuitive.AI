"use client"

import { useState } from 'react'
import { gql, useMutation } from "@apollo/client"
import client from '@/utils/apolloClient'

const ADD_FILE_MUTATION = gql`
            mutation AddFile($section_id: ID!, $name: String!, $question_type: String!, $file_name: String!, $file: String!) {
               addQuestion(section_id: $section_id, name: $name, question_type: $question_type, file_name: $file_name, file: $file) {
               objectId
               name
               }
            }`

const AddFile = ({ sectionId, isFile, setIsFile }) => {
   const [title, setTitle] = useState('')
   const [pdfFile, setpdfFile] = useState("")
   const [addQuestion] = useMutation(ADD_FILE_MUTATION, { client })

   const handleFileChange = (e) => {
      const selectedFile = e.target.files[0]

      if (selectedFile) {
         const reader = new FileReader()
         reader.readAsDataURL(selectedFile)
         reader.onloadend = () => {
            setpdfFile(reader.result)
         }
      }
   }

   const sendForm = async () => {

      try {
         const { data } = await addQuestion({
            variables: {
               section_id: sectionId,
               question_type: "File",
               name: title,
               file_name: title,
               file: pdfFile
            },
         })
         setTitle('')
         setIsFile(false)
      } catch (error) {
         setErrors(error.response.data)
         console.error('Error adding section:', error)
      }
   }

   return (
      <>
         <div className={isFile ? "form question-form visible" : "form question-form invisible"}>
            <label className="form__label" htmlFor="title">Name of the file:</label>
            <input
               className="form__input"
               type="text"
               id="title"
               name="title"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
            />

            <label className="form__label" htmlFor="pdf_file">PDF File:</label>
            <input
               className="form__input"
               type="file"
               id="pdf_file"
               name="pdf_file"
               accept="application/pdf"
               onChange={handleFileChange}
            />

            <button className="form__button" onClick={sendForm} disabled={!pdfFile}>
               Add
            </button>
         </div >
      </>
   )
}

export default AddFile
