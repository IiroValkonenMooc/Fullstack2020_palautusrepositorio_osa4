const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blogModel')

const api = supertest(app)

const initialBloglist = [
    {
        title: 'How to be a mailman',
        author: 'Male man',
        url: 'www.notarealplace.org',
        likes: 13
    },
    {
        title: 'Trust the plan',
        author: 'Q',
        url: 'www.totallyarealplace.org',
        likes: 20
    }
]

beforeEach( async () => {
    await Blog.deleteMany({})

    for (let blog of initialBloglist) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})

test('blogslist is returned as JSON', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

afterAll(() => {
    mongoose.connection.close()
})