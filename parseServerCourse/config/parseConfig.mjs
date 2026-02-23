import dotenv from 'dotenv'
import config from './default.mjs'
import DummyPushAdapter from '../cloud/DummyPushAdapter.js'

import Course from '../schemas/Course.json' with { type: 'json' }
import Section from '../schemas/Section.json' with { type: 'json' }
import Question from '../schemas/Question.json' with { type: 'json' }
import QuizQuestion from '../schemas/Quiz-Question.json' with { type: 'json' }
import Answer from '../schemas/Answer.json' with { type: 'json' }
import AI_Assistent from '../schemas/AIAssistent.json' with { type: 'json' }
import User from '../schemas/_User.json' with { type: 'json' }

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
      definitions: [Course, Section, Question, QuizQuestion, Answer, AI_Assistent, User],
      lockSchemas: true,
      strict: true,
      recreateModifiedFields: true,
   },
   push: {
      adapter: new DummyPushAdapter(),
   }
}