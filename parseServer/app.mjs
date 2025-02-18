import { ParseServer, ParseGraphQLServer } from 'parse-server'
import express from 'express'
import gql from 'graphql-tag'
import fs from 'fs'
import parseConfig from './config/parseConfig.mjs'

const sectionSchema = fs.readFileSync('./graphql/section.graphql')
const quizSchema = fs.readFileSync('./graphql/quiz.graphql')
const videoSchema = fs.readFileSync('./graphql/video.graphql')
const app = express()

const parseServer = new ParseServer(parseConfig)

await parseServer.start()

const parseGraphQLServer = new ParseGraphQLServer(
    parseServer,
    {
        graphQLPath: '/graphql',
        playgroundPath: '/playground',
        graphQLCustomTypeDefs: gql`${sectionSchema} ${quizSchema} ${videoSchema}`
    }
)
app.use('/parse', parseServer.app)

parseGraphQLServer.applyGraphQL(app)

parseGraphQLServer.applyPlayground(app)

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
