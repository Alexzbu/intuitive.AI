import { ParseServer, ParseGraphQLServer } from 'parse-server'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import gql from 'graphql-tag'
import fs from 'fs'
import parseConfig from './config/parseConfig.mjs'
import config from './config/default.mjs'
import { initWhiteboardCollab } from './collab/whiteboardCollab.mjs'
import { initChatCollab } from './collab/chatCollab.mjs'

const courseSchema = fs.readFileSync('./graphql/course.graphql', 'utf8')
const authSchema   = fs.readFileSync('./graphql/auth.graphql',   'utf8')
const app = express()

const parseServer = new ParseServer(parseConfig)

await parseServer.start()

const parseGraphQLServer = new ParseGraphQLServer(
    parseServer,
    {
        graphQLPath: '/graphql',
        playgroundPath: '/playground',
        graphQLCustomTypeDefs: gql`${courseSchema}\n${authSchema}`
    }
)
app.use('/parse', parseServer.app)

app.use('/graphql', express.json({ limit: '50mb' }))

parseGraphQLServer.applyGraphQL(app)

parseGraphQLServer.applyPlayground(app)

const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN.split(','),
        methods: ['GET', 'POST']
    }
})

initWhiteboardCollab(io)
initChatCollab(io)

const port = config.port || 3000
httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
