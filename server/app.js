const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const userRouter = require('./src/routes/users/user.router')
const chatRouter = require('./src/routes/chats/chat.router')
const messageRouter = require('./src/routes/messages/message.router')

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use("/api/user",userRouter)
app.use("/api/chat",chatRouter)
app.use("/api/message",messageRouter)


module.exports = app