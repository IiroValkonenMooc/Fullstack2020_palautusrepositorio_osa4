const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/userModel')

const api = supertest(app)

beforeEach( async () => {
    await User.deleteMany({})

    // for (let blog of initialBloglist) {
    //     let blogObject = new Blog(blog)
    //     await blogObject.save()
    // }
})

describe( 'User_creation_tests', () => {
    const testUser = {
        username: 'Male Man',
        name: 'Mailman',
        password: 'testpassword'
    }

    test('user can be created', async () => {
        const resObject = await api
            .post('/api/users')
            .send(testUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(resObject.body.name).toBeDefined()
        expect(resObject.body.name).toBeDefined()
        expect(resObject.body.id).toBeDefined()
        expect(resObject.body.username).toEqual('Male Man')
        expect(resObject.body.name).toEqual('Mailman')
        expect(resObject.body.password).not.toBeDefined()
        expect(resObject.body.passwordHash).not.toBeDefined()
    })
})

afterAll(() => {
    mongoose.connection.close()
})