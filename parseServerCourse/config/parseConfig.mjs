import dotenv from 'dotenv'
import config from './default.mjs'

import Course from '../schemas/Course.json' assert { type: 'json' }
import Section from '../schemas/Section.json' assert { type: 'json' }
import Question from '../schemas/Question.json' assert { type: 'json' }
import QuizQuestion from '../schemas/Quiz-Question.json' assert { type: 'json' }
import Answer from '../schemas/Answer.json' assert { type: 'json' }
import AI_Assistent from '../schemas/AIAssistent.json' assert { type: 'json' }

dotenv.config()

export default {
   databaseURI: config.mongoURI,
   cloud: './cloud/main.js',
   appId: 'myAppId123',
   masterKey: 'myMasterKey123',
   serverURL: 'http://localhost:3000/parse',
   publicServerURL: 'http://localhost:3000/parse',
   logLevel: "error",
   encodeParseObjectInCloudFunction: true,
   fileUpload: {
      enableForPublic: true,
   },
   schema: {
      definitions: [Course, Section, Question, QuizQuestion, Answer, AI_Assistent],
      lockSchemas: true,
      strict: true,
      recreateModifiedFields: true,

   }
}