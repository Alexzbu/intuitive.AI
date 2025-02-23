import { ParseServer, ParseGraphQLServer } from 'parse-server'
import express from 'express'
import gql from 'graphql-tag'
import fs from 'fs'
import parseConfig from './config/parseConfig.mjs'

const courseSchema = fs.readFileSync('./graphql/course.graphql')
const app = express()

const parseServer = new ParseServer(parseConfig)

await parseServer.start()

const parseGraphQLServer = new ParseGraphQLServer(
    parseServer,
    {
        graphQLPath: '/graphql',
        playgroundPath: '/playground',
        graphQLCustomTypeDefs: gql`${courseSchema}`
    }
)
app.use('/parse', parseServer.app)

app.use('/graphql', express.json({ limit: '50mb' }))

parseGraphQLServer.applyGraphQL(app)

parseGraphQLServer.applyPlayground(app)

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
