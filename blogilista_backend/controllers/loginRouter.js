const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const express = require('express')
const loginRouter = express.Router()
const User = require('../models/userModel')

loginRouter.post('/', async (request, response) => {
    console.log('asd')
    const user = await User.findOne({ username: request.body.username })

    const passwordCorrect = (user === null)
        ? false
        : await bcrypt.compare(request.body.password, user.passwordHash)

    if(!(user && passwordCorrect)){
        response.status(401).json(
            {
                error: 'invalid username or password'
            }
        )
    }

    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    response.status(200).send(
        {
            token,
            username: user.username,
            name: user.name
        }
    )
})

module.exports = loginRouter