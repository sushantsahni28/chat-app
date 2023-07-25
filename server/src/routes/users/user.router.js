const express = require('express')
const { Signup, Login, Logout, searchUsers } = require('./user.controller')
const protect = require('../../middlewares/authMiddle')

const userRouter = express.Router()

userRouter.post("/signup",Signup)
userRouter.post("/login",Login)
userRouter.get("/logout",Logout)

userRouter.get("/:find",protect,searchUsers)

module.exports = userRouter