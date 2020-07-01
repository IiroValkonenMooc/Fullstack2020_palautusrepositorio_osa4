const express = require('express')
const blogsRouter = express.Router()
const Blog = require('../models/blogModel')
const { request, response } = require('../app')

blogsRouter.get('/', async (request, response) => {
    // Blog
    //     .find({})
    //     .then(blogs => {
    //         response.json(blogs)
    //     })
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    // blog
    //     .save()
    //     .then(result => {
    //         response.status(201).json(result)
    //     })

    const blogObject = await blog.save()

    response.status(201).json(blogObject)
})

blogsRouter.delete('/:id', async (request, response) => {
    const id = request.params.id

    await Blog.findByIdAndDelete(id)

    response.status(202).end()
})

blogsRouter.patch('/:id', async (request, response) => {
    const id = request.params.id
    const dataToUpdate = request.body

    await Blog.findByIdAndUpdate(id, dataToUpdate)

    response.status(202).json(dataToUpdate)
})

module.exports = blogsRouter