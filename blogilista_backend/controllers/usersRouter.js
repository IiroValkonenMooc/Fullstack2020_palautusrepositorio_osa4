const bcrypt = require('bcrypt')
const express = require('express')
const userRouter = express.Router()
const User = require('../models/userModel')

userRouter.post('/', async (request, response) => {
    const saltRounds = 13
    const passwordHash = await bcrypt.hash(request.body.password, saltRounds)

    const user = new User ({
        username: request.body.username,
        name: request.body.name,
        passwordHash: passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

module.exports = userRouter