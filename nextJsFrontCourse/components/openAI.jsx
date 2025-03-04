import { useState } from "react"
import { gql, useMutation } from "@apollo/client"
import client from '@/utils/apolloClient'

const AI_ASSISTENT = gql`
           mutation aiAssistent {
               aiAssistent
            }`

const Chatbot = ({ setTitle, setSubtitle, setObjective, setTarget_group, setRecommendation, setKey_words,
   setDescription, setShowAI, questionsHistory, setQuestionsHistory, resObjectsHistory, setresObjectsHistory }) => {
   const [question, setQuestion] = useState("")
   const [questionFoDisplay, setquestionFoDisplay] = useState("")
   const [resObjects, setResObjects] = useState([])
   const [functions, setFunctions] = useState([setTitle, setSubtitle, setObjective, setTarget_group, setRecommendation, setKey_words, setDescription])
   const [response, setResponse] = useState(false)
   const [loading, setLoading] = useState(false)
   const [aiAssistent] = useMutation(AI_ASSISTENT, { client })


   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
         const { data } = await aiAssistent({

         })

         setResObjects(data.aiAssistent)
         setresObjectsHistory((prevQuestions) => [
            ...prevQuestions, data.aiAssistent
         ])
         setQuestionsHistory((prevQuestions) => [
            ...prevQuestions, question
         ])
         setquestionFoDisplay(question)
         setQuestion('')
         setResponse(true)
      } catch (error) {
         console.error("Error:", error)
      } finally {
         setLoading(false)
      }
   }

   const saveAnswer = () => {
      functions.forEach((item, index) => {
         item(resObjects[index].content)
      })
   }

   return (
      <div className="chat-container">
         <h2>AI Assistant</h2>
         <div className="chat-container__chat">
            {questionFoDisplay && <p>USER: {questionFoDisplay}</p>}
            {response &&
               <div>AI:
                  <ul>
                     {resObjects.map((item, index) =>
                        <li key={index}>{item.name}: {item.content}</li>
                     )}
                  </ul>
               </div>}
            {response &&
               <button
                  className="form__button"
                  onClick={() => { saveAnswer(); setShowAI(false) }}
               >Accept & Save
               </button>
            }
         </div>

         <form className="chat-container__form form" onSubmit={handleSubmit}>
            <input
               className="form__input"
               type="text"
               value={question}
               onChange={(e) => setQuestion(e.target.value)}
               placeholder="What is your course about?"
               required
            />
            <div className="chat-container__actions actions-button">
               <button className="form__button actions-button__item" type="submit" disabled={loading}>
                  {loading ? "Thinking..." : "Send"}
               </button>
               <button
                  onClick={() => setShowAI(false)}
                  className="form__button actions-button__item actions-button__item--close"
               >Close without saving
               </button>
            </div>
         </form>

      </div >
   )
}

export default Chatbot
