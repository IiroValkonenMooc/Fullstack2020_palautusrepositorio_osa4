const express = require('express')
const blogsRouter = express.Router()
const Blog = require('../models/blogModel')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user')
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

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