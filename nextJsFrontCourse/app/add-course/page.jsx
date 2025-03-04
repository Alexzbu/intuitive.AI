"use client"

import { useState } from 'react'
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

const AI_ASSISTENT = gql`
           mutation aiAssistent($course_id: ID, $questionsHistory: [String], $resObjectsHistory: [Object]) {
               aiAssistent(course_id: $course_id, questionsHistory: $questionsHistory, resObjectsHistory: $resObjectsHistory)
            }`

const AddCourse = () => {
   const router = useRouter()
   const [title, setTitle] = useState('')
   const [subtitle, setSubtitle] = useState('')
   const [objective, setObjective] = useState('')
   const [target_group, setTarget_group] = useState('')
   const [recommendation, setRecommendation] = useState('')
   const [key_words, setKey_words] = useState('')
   const [description, setDescription] = useState('')
   const [errors, setErrors] = useState({})
   const [showAI, setShowAI] = useState(false)
   // const [questionFoDisplay, setquestionFoDisplay] = useState("")
   // const [resObjects, setResObjects] = useState([])
   const [questionsHistory, setQuestionsHistory] = useState([])
   const [resObjectsHistory, setresObjectsHistory] = useState([])
   const [addCourse] = useMutation(ADD_COURSE_MUTATION, { client })
   const [aiAssistent] = useMutation(AI_ASSISTENT, { client })

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

         await aiAssistent({
            variables: {
               course_id: data.addCourse.objectId,
               questionsHistory: questionsHistory,
               resObjectsHistory: resObjectsHistory
            }
         })
         // console.log(data.addCourse.objectId)
         // console.log(resObjectsHistory)

         if (data.addCourse.objectId) {
            router.push(`/add-section?id=${data.addCourse.objectId}`)
         }
      } catch (error) {
         setErrors(error.response.data)
         console.error('Error adding course:', error)
      }
   }

   return (
      <div className="container">
         <h1 className="title">Add new course</h1>
         <div className="form">
            {showAI &&
               <Chatbot setTitle={setTitle} setSubtitle={setSubtitle} setObjective={setObjective}
                  setTarget_group={setTarget_group} setRecommendation={setRecommendation}
                  setKey_words={setKey_words} setDescription={setDescription} setShowAI={setShowAI}
                  questionsHistory={questionsHistory} setQuestionsHistory={setQuestionsHistory}
                  resObjectsHistory={resObjectsHistory} setresObjectsHistory={setresObjectsHistory} />
            }
            {!showAI &&
               <button
                  className="form__button actions-button__item actions-button__item--AI"
                  onClick={() => setShowAI(true)}
               >Call AI Assistent</button>
            }
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

            <label className="form__label" htmlFor="subtitle">Objective:</label>
            <input
               className="form__input"
               type="text"
               id="objective"
               name="objective"
               value={objective}
               onChange={(e) => setObjective(e.target.value)}
            />
            {errors.objective && <span className="error">{errors.objective}</span>}

            <label className="form__label" htmlFor="subtitle">Target_group:</label>
            <input
               className="form__input"
               type="text"
               id="target_group"
               name="target_group"
               value={target_group}
               onChange={(e) => setTarget_group(e.target.value)}
            />
            {errors.target_group && <span className="error">{errors.target_group}</span>}

            <label className="form__label" htmlFor="subtitle">Recommendation:</label>
            <input
               className="form__input"
               type="text"
               id="recommendation"
               name="recommendation"
               value={recommendation}
               onChange={(e) => setRecommendation(e.target.value)}
            />
            {errors.target_group && <span className="error">{errors.target_group}</span>}

            <label className="form__label" htmlFor="subtitle">Key_words:</label>
            <input
               className="form__input"
               type="text"
               id="key_words"
               name="key_words"
               value={key_words}
               onChange={(e) => setRecommendation(e.target.value)}
            />
            {errors.target_group && <span className="error">{errors.target_group}</span>}

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
