import dotenv from 'dotenv'
import config from './default.mjs'
import CourseOverview from '../schemas/Course_overview.json'
import Answer from '../schemas/Answer.json' assert { type: 'json' }
import PDF_File from '../schemas/PDF_File.json' assert { type: 'json' }
import Question from '../schemas/Question.json' assert { type: 'json' }
import Quiz from '../schemas/Quiz.json' assert { type: 'json' }
import Lecture from '../schemas/Lecture.json' assert { type: 'json' }
import Video from '../schemas/Video.json' assert { type: 'json' }
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
      definitions: [CourseOverview, Answer, PDF_File, Question, Quiz, Lecture, Video],

   }
}