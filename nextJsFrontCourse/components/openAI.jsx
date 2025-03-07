import { useState } from "react"
import { gql, useMutation, useLazyQuery } from "@apollo/client"
import client from '@/utils/apolloClient'

const AI_ASSISTENT = gql`
           mutation aiAssistent($prompt: String, $inputId: String) {
               aiAssistent(prompt: $prompt, inputId: $inputId)
            }`

const GET_AI_ASSISTENT_HISTORY = gql`
            mutation getAiAssistentHistory($request: String!) {
               getAiAssistentHistory(request: $request) {
                  objectId
                  request
                  response{
                     name
                     content
                  }
               }
            }
            `

const Chatbot = ({ setTitle, setSubtitle, setObjective, setTarget_group, setRecommendation, setKey_words,
   setDescription, showAI, setShowAI, questionsHistory, setQuestionsHistory, resObjectsHistory, setresObjectsHistory, inputId }) => {
   const [question, setQuestion] = useState('')
   const [search, setSearch] = useState('')
   const [questionFoDisplay, setquestionFoDisplay] = useState('')
   const [resObjects, setResObjects] = useState([])
   const [history, setHistory] = useState([])
   // const [historyDetails, setHistoryDetails] = useState([])
   const [functions, setFunctions] = useState([setTitle, setSubtitle, setObjective, setTarget_group, setRecommendation, setKey_words, setDescription])
   const [response, setResponse] = useState(false)
   const [loading, setLoading] = useState(false)
   const [aiAssistent] = useMutation(AI_ASSISTENT, { client })
   const [fetchHistory] = useMutation(GET_AI_ASSISTENT_HISTORY, { client })
   // const [fetchHistory, { data, error }] = useLazyQuery(GET_AI_ASSISTENT_HISTORY, {
   //    client,
   //    variables: { request: search },
   //    fetchPolicy: 'network-only',
   // })


   const handleSubmit = async () => {
      setLoading(true);

      try {
         const { data } = await aiAssistent({
            variables: {
               prompt: question,
               inputId: inputId
            }
         })

         setResObjects(data.aiAssistent)
         setresObjectsHistory((prevQuestions) => [
            ...prevQuestions, data.aiAssistent
         ])
         setQuestionsHistory((prevQuestions) => [
            ...prevQuestions, question.toLowerCase()
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
   const close = () => {
      setShowAI(false);
      setResponse(false);
      setResObjects([]);
      setQuestionsHistory([]);
      setresObjectsHistory([]);
      setquestionFoDisplay('');
      setQuestion('');
   }
   const saveAnswer = () => {
      // functions.forEach((item, index) => {
      //    item(resObjects[index].content)
      // })
      resObjects.forEach((item) => {
         switch (item.name) {
            case "course title":
               setTitle(item.content);
               break;
            case "course subtitle":
               setSubtitle(item.content);
               break;
            case "course objective":
               setObjective(item.content);
               break;
            case "course target_group":
               setTarget_group(item.content);
               break;
            case "course recommendation":
               setRecommendation(item.content);
               break;
            case "course key_words":
               setKey_words(item.content);
               break;
            case "course description":
               setDescription(item.content);
               break;
            default:
               console.log("Unknown item:", item);
         }
      })

   }
   const fetchAiHistory = async () => {
      try {
         const { data } = await fetchHistory({
            variables: { request: search }
         })
         setHistory(data?.getAiAssistentHistory)
         // setHistoryDetails(data?.getAiAssistentHistory.response)
         console.log(data?.getAiAssistentHistory)
         data?.getAiAssistentHistory?.forEach(item => {
            // setHistoryDetails(())
            item?.response.forEach(result => {
               console.log(result.name)
            });
         })
      } catch (error) {
         console.error("Error:", error)
      }
   }

   return (
      <div className={showAI ? "chat chat--visible" : "chat"}>
         <div className="chat__content content">
            {/* <div className="chat__search search">
               <input
                  className="search__field"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Find previous questions"
               />
               <button onClick={() => fetchAiHistory()}>Send</button> */}
            {/* {response && */}
            {/* <div className="search__result result-chat">
                  <ul className="result__items items">
                     {history?.map((item, index) =>
                        <li className="result__item" key={index}>
                           <button
                              className="item__button"
                              onClick={() => setQuestion(item.request)}
                           >
                              {item.request}
                           </button>
                           <ul className="item__details">
                              {resObjects?.map((item, index) =>
                                 <li key={index}>{item.name}: {item.content}</li>
                              )}
                           </ul>
                        </li>
                     )}
                  </ul>
               </div> */}
            {/* } */}
            {/* </div> */}
            <h2>AI Assistant</h2>
            <div className="chat__form form" >
               <input
                  className="form__input"
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={
                     inputId
                        ? `Would you like to improve your ${inputId}`
                        : response
                           ? "If you have any corrections, please tell me"
                           : "What is your course about?"
                  }
               />
               <div className="chat__actions actions-button">
                  <button
                     className="form__button actions-button__item"
                     onClick={() => handleSubmit()}
                     disabled={loading}>
                     {loading ? "Thinking..." : "Send"}
                  </button>
                  <button
                     onClick={() => close()}
                     className="form__button actions-button__item actions-button__item--close"
                  >Close without saving
                  </button>
               </div>
            </div>
            <div className="form__chat">
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
                     onClick={() => { saveAnswer(); setShowAI(false); setResObjects([]); setquestionFoDisplay('') }}
                  >Accept & Save
                  </button>
               }
            </div>
         </div>
      </div >
   )
}

export default Chatbot
