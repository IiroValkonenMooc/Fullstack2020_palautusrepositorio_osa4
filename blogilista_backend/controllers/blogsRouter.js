const express = require('express')
const blogsRouter = express.Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blogModel')
const User = require('../models/userModel')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user')
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    let blog = new Blog(request.body)

    let userObjectToModify = await User.findById(decodedToken.id)

    if(!userObjectToModify){
        response.status(400).json({ error: 'user invalid' })
    }

    blog.user = decodedToken.id

    const blogObject = await blog.save()

    userObjectToModify.addedBlogs
        ? userObjectToModify.addedBlogs.push(blogObject._id)
        : userObjectToModify.addedBlogs = [blogObject._id]

    const updatedUserObject =  await User.findByIdAndUpdate(decodedToken.id, userObjectToModify)

    response.status(201).json(blogObject)
})

blogsRouter.delete('/:id', async (request, response) => {
    const id = request.params.id

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blogToDelete = await Blog.findById(id)
    if(!(blogToDelete.user.toString() === decodedToken.id.toString())){
        return response.status(401).json({ error: 'invalid user' })
    }

    let userToModify =await User.findById(decodedToken.id)
    const indexToDelete = userToModify.addedBlogs.findIndex(x => x.toString() === id)
    userToModify.addedBlogs.splice(indexToDelete,1)

    //console.log('userToModify.addedBlogs :>> ', userToModify.addedBlogs)
    //console.log('userToModify :>> ', userToModify);

    await Blog.findByIdAndDelete(id)
    await User.findByIdAndUpdate(decodedToken.id, userToModify)

    response.status(202).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const id = request.params.id
    let dataToUpdate = request.body

    //dataToUpdate.user = dataToUpdate.user.id

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blogToModify = await Blog.findById(id).populate()
    // if(!(blogToModify.user.toString() === decodedToken.id.toString())){
    //     return response.status(401).json({ error: 'invalid user' })
    // }

    if(blogToModify._id.toString() !== id) { return response.status(401).json( { error: 'invalid blog' }) }
    else if(blogToModify.title !== dataToUpdate.title) { return response.status(401).json( { error: 'invalid blog' }) }
    else if(blogToModify.author !== dataToUpdate.author) { return response.status(401).json( { error: 'invalid blog' }) }
    else if(blogToModify.url !== dataToUpdate.url) { return response.status(401).json( { error: 'invalid blog' }) }
    else if(blogToModify.user.toJSON() !== dataToUpdate.user) { return response.status(401).json( { error: 'invalid blog' }) }
    else if(blogToModify.likes + 1 < dataToUpdate.likes) { return response.status(401).json( { error: 'invalid blog' }) }

    await Blog.findByIdAndUpdate(id, dataToUpdate)

    response.status(202).json(dataToUpdate)
})

blogsRouter.patch('/:id', async (request, response) => {
    const id = request.params.id
    let dataToUpdate = request.body

    //dataToUpdate.user = dataToUpdate.user.id

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blogToModify = await Blog.findById(id).populate()
    // if(!(blogToModify.user.toString() === decodedToken.id.toString())){
    //     return response.status(401).json({ error: 'invalid user' })
    // }

    if(blogToModify._id.toString() !== id) { return response.status(401).json( { error: 'invalid blog' }) }
    else if(blogToModify.title !== dataToUpdate.title) { return response.status(401).json( { error: 'invalid blog' }) }
    else if(blogToModify.author !== dataToUpdate.author) { return response.status(401).json( { error: 'invalid blog' }) }
    else if(blogToModify.url !== dataToUpdate.url) { return response.status(401).json( { error: 'invalid blog' }) }
    else if(blogToModify.user.toJSON() !== dataToUpdate.user) { return response.status(401).json( { error: 'invalid blog' }) }
    else if(blogToModify.likes + 1 < dataToUpdate.likes) { return response.status(401).json( { error: 'invalid blog' }) }

    await Blog.findByIdAndUpdate(id, dataToUpdate)

    response.status(202).json(dataToUpdate)
})

module.exports = blogsRouter