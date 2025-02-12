import { ParseServer, ParseGraphQLServer } from 'parse-server'
import express from 'express'
import gql from 'graphql-tag'
import config from './config/default.mjs'
import carSchema from './schemas/Car.json' assert { type: 'json' }
// import parseConfig from './parse-server-config.json'
import fs from 'fs'

const customSchema = fs.readFileSync('./cloud/schema.graphql')
const app = express()

const parseConfig = {
    databaseURI: config.mongoURI,
    cloud: './cloud/main.js',
    appId: 'myAppId123',
    masterKey: 'myMasterKey123',
    serverURL: 'http://localhost:3000/parse',
    publicServerURL: 'http://localhost:3000/parse',
    encodeParseObjectInCloudFunction: true,
    schema: {
        definition: carSchema
    }

}
const parseServer = new ParseServer(parseConfig)

await parseServer.start()

const parseGraphQLServer = new ParseGraphQLServer(
    parseServer,
    {
        graphQLPath: '/graphql',
        playgroundPath: '/playground',
        graphQLCustomTypeDefs: gql`${customSchema}`
    }
)
app.use('/parse', parseServer.app)

parseGraphQLServer.applyGraphQL(app)

parseGraphQLServer.applyPlayground(app)

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
