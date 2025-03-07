"use client"

import { useState, useEffect } from 'react'
import { gql, useMutation } from "@apollo/client"
import client from '@/utils/apolloClient'
import { useRouter } from "next/navigation"
import Chatbot from '@/components/openAI'

const ADD_COURSE_MUTATION = gql`
            mutation AddCourse($name: String!, $subtitle: String, $objective: String, $target_group: String, $recommendation: String, $key_words: [String], $description: String!) {
               addCourse(name: $name, subtitle: $subtitle, objective: $objective, target_group: $target_group, recommendation: $recommendation, key_words: $key_words, description: $description) {
               objectId
               name
               }
            }`

const ADD_AI_ASSISTENT_HISTORY = gql`
           mutation addAiAssistentHistory($course_id: ID, $questionsHistory: String, $resObjectsHistory: [Object]) {
               addAiAssistentHistory(course_id: $course_id, questionsHistory: $questionsHistory, resObjectsHistory: $resObjectsHistory)
            }`

const GET_AI_ASSISTENT_HISTORY = gql`
            mutation getAiAssistentHistory($prompt: String!) {
               getAiAssistentHistory(prompt: $prompt) {
                  objectId
                  request
                  response{
                     name
                     content
                  }
               }
            }
            `

const AddCourse = () => {
   const router = useRouter()
   const [inputId, setInputId] = useState('')
   const [title, setTitle] = useState('')
   const [subtitle, setSubtitle] = useState('')
   const [objective, setObjective] = useState('')
   const [target_group, setTarget_group] = useState('')
   const [recommendation, setRecommendation] = useState('')
   const [key_words, setKey_words] = useState('')
   const [description, setDescription] = useState('')
   const [functions, setFunctions] = useState([setTitle, setSubtitle, setObjective, setTarget_group, setRecommendation, setKey_words, setDescription])
   const [errors, setErrors] = useState({})
   const [showAI, setShowAI] = useState(false)
   const [search, setSearch] = useState('')
   const [history, setHistory] = useState([])
   const [resObjects, setResObjects] = useState([])
   const [response, setResponse] = useState(false)
   const [questionsHistory, setQuestionsHistory] = useState([])
   const [resObjectsHistory, setresObjectsHistory] = useState([])
   const [addCourse] = useMutation(ADD_COURSE_MUTATION, { client })
   const [addAiAssistentHistory] = useMutation(ADD_AI_ASSISTENT_HISTORY, { client })
   const [fetchHistory] = useMutation(GET_AI_ASSISTENT_HISTORY, { client })

   useEffect(() => {

      if (search) {
         fetchAiHistory()
      }
   }, [search])

   const sendForm = async () => {
      try {
         const { data } = await addCourse({
            variables: {
               name: title,
               subtitle: subtitle,
               objective: objective,
               target_group: target_group,
               recommendation: recommendation,
               key_words: key_words,
               description: description,
            },
         })

         if (questionsHistory.length > 0) {
            await addAiAssistentHistory({
               variables: {
                  course_id: data.addCourse.objectId,
                  questionsHistory: questionsHistory[0],
                  resObjectsHistory: resObjectsHistory[resObjectsHistory.length - 1]
               }
            })
         }

         if (data.addCourse.objectId) {
            router.push(`/add-section?id=${data.addCourse.objectId}`)
         }
      } catch (error) {
         setErrors(error.response.data)
         console.error('Error adding course:', error)
      }
   }

   const fetchAiHistory = async () => {
      try {
         const { data } = await fetchHistory({
            variables: { prompt: search }
         })
         setHistory(data?.getAiAssistentHistory)

         if (data.getAiAssistentHistory.length > 0) {
            setResponse(true)
         }
         else {
            setResponse(false)
         }

      } catch (error) {
         console.error("Error:", error)
      }
   }

   const fillFields = (index) => {
      history[index].response.forEach((item, index) => {
         functions[index](item.content)
      })
      setSearch('')
      setResponse(false)
   }

   return (
      <div className="container">
         <div className="add-couse__search search">
            <input
               className="search__field search__field--add-course"
               type="search"
               value={search}
               onChange={(e) => setSearch(e.target.value)}

               placeholder="Find previous questions"
            />
            {/* {response && */}
            <div className={response && search ? "search__result result result--visible" : "search__result result"}>
               <ul className="result__items search-items">
                  {history?.map((item, index) =>
                     <li className="search-items__item" key={index}>
                        <button
                           className="item__button"
                           onClick={() => fillFields(index)}
                        >
                           {item.request}
                        </button>
                     </li>
                  )}
               </ul>
            </div>
            {/* } */}
         </div>
         <h1 className="title">Add new course</h1>
         <div className="form">
            <Chatbot setTitle={setTitle} setSubtitle={setSubtitle} setObjective={setObjective}
               setTarget_group={setTarget_group} setRecommendation={setRecommendation}
               setKey_words={setKey_words} setDescription={setDescription} setShowAI={setShowAI}
               questionsHistory={questionsHistory} setQuestionsHistory={setQuestionsHistory}
               resObjectsHistory={resObjectsHistory} setresObjectsHistory={setresObjectsHistory}
               showAI={showAI} inputId={inputId} />

            <label className="form__label" htmlFor="title">Name of the course:</label>
            <div className='form_input-box'>
               <input
                  className="form__input"
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
               />
               <button
                  className="form__button actions-button__item actions-button__item--ai"
                  onClick={() => {
                     setShowAI(true);
                     if (title) {
                        setInputId("title");
                     }
                  }}
               >AI
               </button>
            </div>
            {errors.title && <span className="error">{errors.title}</span>}

            <label className="form__label" htmlFor="subtitle">Subtitle:</label>
            <div className='form_input-box'>
               <input
                  className="form__input"
                  type="text"
                  id="subtitle"
                  name="subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
               />
               <button
                  className="form__button actions-button__item actions-button__item--ai"
                  onClick={() => { setShowAI(true); setInputId("subtitle") }}
               >AI
               </button>
            </div>
            {errors.subtitle && <span className="error">{errors.subtitle}</span>}

            <label className="form__label" htmlFor="subtitle">Objective:</label>
            <div className='form_input-box'>
               <input
                  className="form__input"
                  type="text"
                  id="objective"
                  name="objective"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
               />
               <button
                  className="form__button actions-button__item actions-button__item--ai"
                  onClick={() => { setShowAI(true); setInputId("objective") }}
               >AI
               </button>
            </div>
            {errors.objective && <span className="error">{errors.objective}</span>}

            <label className="form__label" htmlFor="subtitle">Target_group:</label>
            <div className='form_input-box'>
               <input
                  className="form__input"
                  type="text"
                  id="target_group"
                  name="target_group"
                  value={target_group}
                  onChange={(e) => setTarget_group(e.target.value)}
               />
               <button
                  className="form__button actions-button__item actions-button__item--ai"
                  onClick={() => { setShowAI(true); setInputId("target_group") }}
               >AI
               </button>
            </div>
            {errors.target_group && <span className="error">{errors.target_group}</span>}

            <label className="form__label" htmlFor="subtitle">Recommendation:</label>
            <div className='form_input-box'>
               <input
                  className="form__input"
                  type="text"
                  id="recommendation"
                  name="recommendation"
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
               />
               <button
                  className="form__button actions-button__item actions-button__item--ai"
                  onClick={() => { setShowAI(true); setInputId("recommendation") }}
               >AI
               </button>
            </div>
            {errors.target_group && <span className="error">{errors.target_group}</span>}

            <label className="form__label" htmlFor="subtitle">Key_words:</label>
            <div className='form_input-box'>
               <input
                  className="form__input"
                  type="text"
                  id="key_words"
                  name="key_words"
                  value={key_words}
                  onChange={(e) => setRecommendation(e.target.value)}
               />
               <button
                  className="form__button actions-button__item actions-button__item--ai"
                  onClick={() => { setShowAI(true); setInputId("key_words") }}
               >AI
               </button>
            </div>
            {errors.target_group && <span className="error">{errors.target_group}</span>}

            <label className="form__label" htmlFor="description">Description:</label>
            <div className='form_input-box'>
               <textarea
                  className="form__textarea"
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
               ></textarea>
               <button
                  className="form__button actions-button__item actions-button__item--ai"
                  onClick={() => { setShowAI(true); setInputId("description") }}
               >AI
               </button>
            </div>
            {errors.description && <span className="error">{errors.description}</span>}

            <button className="form__button" onClick={sendForm}>
               Add
            </button>
         </div>
      </div>
   );
};

export default AddCourse
