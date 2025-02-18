import dotenv from 'dotenv'
import config from './default.mjs'
import Answer from '../schemas/Answer.json' assert { type: 'json' }
import Course from '../schemas/Course.json' assert { type: 'json' }
import Question from '../schemas/Question.json' assert { type: 'json' }
import Quiz_Question from '../schemas/Quiz_Question.json' assert { type: 'json' }
import Quiz from '../schemas/Quiz.json' assert { type: 'json' }
import Section from '../schemas/Section.json' assert { type: 'json' }
dotenv.config()

export default {
   databaseURI: config.mongoURI,
   cloud: './cloud/main.js',
   appId: 'myAppId123',
   masterKey: 'myMasterKey123',
   serverURL: 'http://localhost:3000/parse',
   publicServerURL: 'http://localhost:3000/parse',
   logLevel: 'silly',
   verbose: true,
   encodeParseObjectInCloudFunction: true,
   schema: {
      definitions: [Answer, Course, Quiz_Question, Question, Quiz, Section],
      lockSchemas: true,
      strict: true,
      recreateModifiedFields: true,

   }
}