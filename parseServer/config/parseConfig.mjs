import dotenv from 'dotenv'
import config from './default.mjs'

import Course from '../schemas/Course.json' assert { type: 'json' }

dotenv.config()

export default {
   databaseURI: config.mongoURI,
   cloud: './cloud/main.js',
   appId: 'myAppId123',
   masterKey: 'myMasterKey123',
   serverURL: 'http://localhost:3000/parse',
   publicServerURL: 'http://localhost:3000/parse',
   // verbose: true,
   encodeParseObjectInCloudFunction: true,
   schema: {
      definitions: Course,
      lockSchemas: true,
      strict: true,
      recreateModifiedFields: true,

   }
}