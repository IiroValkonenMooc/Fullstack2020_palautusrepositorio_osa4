const bcrypt = require('bcrypt')
const express = require('express')
const userRouter = express.Router()
const User = require('../models/userModel')

userRouter.post('/', async (request, response) => {
    if(!request.body.password){
        response.status(400).json({ error: 'password missing' })
    }else if(request.body.password.length < 4) {
        response.status(400).json({ error: 'password too short' })
    } else if (request.body.username.length < 4) {
        response.status(400).json({ error: 'username too short' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(request.body.password, saltRounds)

    let userList = await User.find({})
    userList = userList.map(user => user.username)

    if( userList.includes(request.body.username) ){
        response.status(400).json({ error: 'username already taken' })
    }

    const user = await new User ({
        username: request.body.username,
        name: request.body.name,
        passwordHash: passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

userRouter.get('/', async (request, response) => {
    const users = await User.find()
    const usersNoPw = users.map(user => {
        return (
            {
                id: user.id,
                name: user.name,
                username: user.username
            }
        )
    })

    response.status(200).json(usersNoPw)
})

module.exports = userRouter