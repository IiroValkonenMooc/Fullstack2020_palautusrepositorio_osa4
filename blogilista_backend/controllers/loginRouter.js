const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const express = require('express')
const loginRouter = express.Router()
const User = require('../models/userModel')

loginRouter.post('/', async (request, response) => {
    const user = await User.findOne({ username: request.body.username })

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(request.body.password, user.passwordHash)
    // let passwordCorrect = false
    // if(!user === null){
    //     passwordCorrect = await bcrypt.compare(request.body.password, user.passwordHash)
    // }

    // if(!(passwordCorrect)){
    //     console.log('tässäääääääääääääääääääääääääää');
    //     response.status(401).json(
    //         {
    //             error: 'invalid username or password'
    //         }
    //     )
    // }

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
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