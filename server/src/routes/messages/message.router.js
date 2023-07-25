const express = require('express')
const protect = require('../../middlewares/authMiddle')
const { postMessage, getMessage } = require('./message.controller')

const messageRouter = express.Router()

messageRouter.post("/",protect,postMessage)
messageRouter.get("/:id",protect,getMessage)

module.exports = messageRouter