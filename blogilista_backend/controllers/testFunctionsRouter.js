const express = require('express')
const testFunctionsRouter = express.Router()
const Blog = require('../models/blogModel')
const User = require('../models/userModel')

testFunctionsRouter.post('/resetDb', async (request, response) => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    console.log('reset test DB')

    response.status(200).end()
})

module.exports = testFunctionsRouter