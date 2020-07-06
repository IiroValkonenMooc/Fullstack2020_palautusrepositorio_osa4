const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/userModel')

const api = supertest(app)

beforeEach( async () => {
    const initialUsers = [
        {
            username: 'Hung_Aryan',
            name: 'Hans Luger',
            password: 'notarealpassword'
        },
        {
            username: 'Q',
            name: 'Qanon',
            password: 'tollyarealpassword'
        }
    ]

    await User.deleteMany({})

    for (let user of initialUsers) {
        let userObject = new User(user)
        await userObject.save()
    }
})

describe( 'User_creation_tests', () => {
    const testUser = {
        username: 'Male Man',
        name: 'Mailman',
        password: 'testpassword'
    }

    const testUserNoPassword = {
        username: 'Male Man',
        name: 'Mailman'
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

    test('password cant be left out', async () => {
        const resObject = await api
            .post('/api/users')
            .send(testUserNoPassword)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(resObject.body).toEqual({ error: 'password missing' })
    })

    test('username and password have to be certain lenght', async () => {
        const usernameTooShort = {
            username: 'Ma',
            name: 'Mailman',
            password: 'testpassword'
        }

        const passwordTooShort = {
            username: 'Male Man',
            name: 'Mailman',
            password: 'te'
        }

        const resObjectUsername = await api
            .post('/api/users')
            .send(usernameTooShort)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(resObjectUsername.body).toEqual({ error: 'username too short' })

        const resObjectPw = await api
            .post('/api/users')
            .send(passwordTooShort)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(resObjectPw.body).toEqual({ error: 'password too short' })
    })

    test.only('user is actually saved in DB', async () => {
        const resPostObject = await api
            .post('/api/users')
            .send(testUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const resGetObject = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(resGetObject.body.length).toBe(3)

        expect(resGetObject.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining(
                    {
                        username: 'Male Man',
                        name: 'Mailman'
                    })
            ])
        )

        const foundObject = resGetObject.body.find(x => x.name === 'Mailman')

        expect(foundObject.id).toBeDefined()
    })
})

afterAll(() => {
    mongoose.connection.close()
})