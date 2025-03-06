"use client"

import { useState, useEffect } from 'react'
import { gql, useMutation, useQuery } from "@apollo/client"
import client from '@/utils/apolloClient'

const GET_QUESTUON_QUERY = gql`
         query getQuestion($id: ID!) {
             getQuestion(id: $id) { 
              file_name
              file{
                name
                url
              }
            }
         }`

const UP_PDF_MUTATION = gql`
            mutation upPDF($id: ID!, $name: String!, $file_name: String, $file: String) {
               upQuestion(id: $id, name: $name, file_name: $file_name, file: $file) {
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

const UpdatePDF = ({ Id, setIsUpFile }) => {
   const [title, setTitle] = useState('')
   const [pdfFile, setpdfFile] = useState("")
   const [upQuestion] = useMutation(UP_PDF_MUTATION, { client })
   const [delQuestion] = useMutation(DEL_QUESTION_MUTATION, { client })
   const { data, loading: delLoading, error, refetch } = useQuery(GET_QUESTUON_QUERY, {
      client,
      variables: { id: Id },
      skip: !Id,
   })
   useEffect(() => {
      if (data?.getQuestion?.file_name) {
         setTitle(data?.getQuestion?.file_name)
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
         const { data } = await upQuestion({
            variables: {
               id: Id,
               name: title,
               file_name: title,
               file: pdfFile
            },
         })
         setTitle('')
         setIsUpFile(false)
         window.location.reload()
      } catch (error) {
         setErrors(error.response.data)
         console.error('Error adding section:', error)
      }
   }

   return (
      <>
         <div className="form question-form visible">
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

export default UpdatePDF
