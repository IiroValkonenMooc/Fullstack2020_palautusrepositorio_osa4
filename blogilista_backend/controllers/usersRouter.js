const bcrypt = require('bcrypt')
const express = require('express')
const userRouter = express.Router()
const User = require('../models/userModel')

userRouter.post('/', async (request, response) =>{


    response.send(404).end()
})


module.exports = userRouter