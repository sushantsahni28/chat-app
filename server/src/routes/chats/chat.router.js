const express = require('express')
const protect  = require('../../middlewares/authMiddle.js')
const { addChat, findChat, createGroup, groupMembers } = require('./chat.controller.js')

const chatRouter = express.Router()
 
chatRouter.get("/",protect,findChat)
chatRouter.post("/",protect,addChat)
chatRouter.post("/create",protect,createGroup)
chatRouter.get("/find/:id",protect,groupMembers)


module.exports = chatRouter