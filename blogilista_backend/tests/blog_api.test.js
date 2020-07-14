const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blogModel')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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

let testUser = {
    name: 'Qanon',
    username: 'Q',
    password: 'test',
    addedBlogs: []
}

let testWrongUser = {
    name: 'Mailman',
    username: 'Male Man',
    password: 'test2',
    addedBlogs: []
}

let testUserId = undefined
let testWrongUserId = undefined

beforeEach( async () => {
    const saltRounds = 10
    const testUserPasswordHash = await bcrypt.hash(testUser.password, saltRounds)
    const testWrongUserPasswordHash = await bcrypt.hash(testWrongUser.password, saltRounds)

    await User.deleteMany({})
    testUser.passwordHash = testUserPasswordHash
    const userObject = new User(testUser)
    await userObject.save()
    testWrongUser.passwordHash = testWrongUserPasswordHash
    const wrongUserObject = new User(testWrongUser)
    await wrongUserObject.save()

    await Blog.deleteMany({})

    let defUser = await User.findOne({ username: 'Q' })
    testUserId = defUser._id

    const defWrongUser = await User.findOne({ username: 'Male Man' })
    testWrongUserId = defWrongUser._id

    for (let blog of initialBloglist) {
        blog.user = defUser._id
        let blogObject = new Blog(blog)
        const savedBlog = await blogObject.save()
        defUser.addedBlogs.push(savedBlog.id)
    }

    await User.findByIdAndUpdate(defUser._id, defUser)
})

describe( 'API get test', () => {
    test('blogslist is returned as JSON', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('blogslist is returned id, not _id', async () => {
        const blogs =
            await api.get('/api/blogs')

        expect(blogs.body[0].id).toBeDefined()
    })
})

describe( 'Login tests', () => {
    test('Login can be done', async () => {
        const auth = await api
            .post('/api/login')
            .send({
                username: 'Q',
                password: 'test'
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)


        const decodedToken = jwt.verify(auth.body.token, process.env.SECRET)
        expect(decodedToken.username).toBe('Q')
    })

})

describe( 'API POST test', () => {

    let postTestObject = {
        title: 'Sending post requests',
        author: 'Test man',
        url: 'Someplacemagical',
        likes: 9000
    }

    let postTestObjectMissingLikes = {
        title: 'Sending post requests without likes',
        author: 'Medicine man',
        url: 'NotHere.org'
    }

    let postTestObjectMissingTitle = {
        author: 'Presidude',
        url: 'NotHere.org'
    }

    let postTestObjectMissingUrl = {
        title: 'Forgetting to put urls',
        author: 'Male Man man',
        likes: 3
    }

    let postTestObjectMissingUser = {
        title: 'Forgetting to put urls',
        author: 'Male Man man',
        likes: 3
    }


    test('POST returns right body', async () => {
        const auth = await api
            .post('/api/login')
            .send({
                username: 'Q',
                password: 'test'
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)


        //postTestObject.user = testUserId

        const retObject = await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${auth.body.token.toString()}`)
            .send(postTestObject)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(retObject.body).toHaveProperty('title', 'Sending post requests')
        expect(retObject.body).toHaveProperty('author', 'Test man')
        expect(retObject.body).toHaveProperty('url', 'Someplacemagical')
        expect(retObject.body).toHaveProperty('likes', 9000)
    })

    test('POST user id is taken from token', async () => {
        const auth = await api
            .post('/api/login')
            .send({
                username: 'Q',
                password: 'test'
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)


        const retObject = await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${auth.body.token.toString()}`)
            .send(postTestObject)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const foundBlog = Blog.findOne({ title: 'Sending post requests' })

        expect(foundBlog).toBeDefined()
    })

    test('POSTed object can be found with GET', async () => {
        const auth = await api
            .post('/api/login')
            .send({
                username: 'Q',
                password: 'test'
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)


        //postTestObject.user = testUserId

        const retObject = await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${auth.body.token.toString()}`)
            .send(postTestObject)

        const getObject = await api
            .get('/api/blogs')

        expect(getObject.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining(
                    {
                        title: 'Sending post requests',
                        author: 'Test man',
                        url: 'Someplacemagical',
                        likes: 9000
                    })
            ])
        )
    })

    test('POSTing blogs can be done without setting likes', async () => {
        const auth = await api
            .post('/api/login')
            .send({
                username: 'Q',
                password: 'test'
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        //postTestObjectMissingLikes.user = testUserId

        const retObject = await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${auth.body.token.toString()}`)
            .send(postTestObjectMissingLikes)

        expect(retObject.body).toEqual(
            expect.objectContaining(
                {
                    title: 'Sending post requests without likes',
                    author: 'Medicine man',
                    url: 'NotHere.org',
                    likes: 0
                })
        )
    })

    test('POSTed blog without likes can be found with GET', async () => {
        const auth = await api
            .post('/api/login')
            .send({
                username: 'Q',
                password: 'test'
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        //postTestObjectMissingLikes.user = testUserId

        const retObject = await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${auth.body.token.toString()}`)
            .send(postTestObjectMissingLikes)

        const getObject = await api
            .get('/api/blogs')

        expect(getObject.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining(
                    {
                        title: 'Sending post requests without likes',
                        author: 'Medicine man',
                        url: 'NotHere.org',
                        likes: 0
                    })
            ])
        )
    })

    test('POSTing blogs without title, url or user result in status 400 bad request', async () => {
        const auth = await api
            .post('/api/login')
            .send({
                username: 'Q',
                password: 'test'
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        //postTestObjectMissingTitle.user = testUserId
        //postTestObjectMissingUrl.user = testUserId


        const retObjectNoTitle = await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${auth.body.token.toString()}`)
            .send(postTestObjectMissingTitle)
            .expect(400)

        expect(retObjectNoTitle.status).toBe(400)

        const retObjectNoUrl = await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${auth.body.token.toString()}`)
            .send(postTestObjectMissingUrl)
            .expect(400)

        expect(retObjectNoUrl.status).toBe(400)

        const retObjectNoUser = await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${auth.body.token.toString()}`)
            .send(postTestObjectMissingUser)
            .expect(400)

        expect(retObjectNoUrl.status).toBe(400)
    })
})

describe( 'API_DELETE_test', () => {
    test('Second testblog gets removed and its removed from user addedBlogs too', async () => {
        const getObject  = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(getObject.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining(
                    {
                        title: 'Trust the plan',
                        author: 'Q',
                        url: 'www.totallyarealplace.org',
                        likes: 20
                    })
            ])
        )

        const authQanonId = getObject.body.find(obj => obj.author === 'Q').id

        const auth = await api
            .post('/api/login')
            .send({
                username: 'Q',
                password: 'test'
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogToDelete = await Blog.find({ title: 'Trust the plan' })

        const deleteObject = await api
            .delete(`/api/blogs/${authQanonId}`)
            .set('Authorization', `bearer ${auth.body.token.toString()}`)
            .expect(202)

        const getObjectAfterDel  = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(getObjectAfterDel.body).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining(
                    {
                        title: 'Trust the plan',
                        author: 'Q',
                        url: 'www.totallyarealplace.org',
                        likes: 20
                    })
            ])
        )

        const user = await User.findOne({ username: 'Q' })
        expect(user.addedBlogs).not.toEqual(
            expect.arrayContaining([ blogToDelete._id ])
        )
    })

    test('Wrong user cant delete blogs', async () => {
        const auth = await api
            .post('/api/login')
            .send({
                username: 'Male Man',
                password: 'test2'
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        console.log('auth :>> ', auth)

        const blogToDelete = await Blog.findOne({ title: 'Trust the plan' })

        const deleteObject = await api
            .delete(`/api/blogs/${blogToDelete._id}`)
            .set('Authorization', `bearer ${auth.body.token.toString()}`)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        expect(deleteObject.body).toEqual({ error: 'invalid user' })
    })
})

describe( 'API_PATCH_test', () => {
    test('blog data changes on PATCh request', async () => {
        const getObject  = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(getObject.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining(
                    {
                        title: 'Trust the plan',
                        author: 'Q',
                        url: 'www.totallyarealplace.org',
                        likes: 20
                    })
            ])
        )

        const authQanonId = getObject.body.find(obj => obj.author === 'Q').id

        const newQanon = {
            title: 'Trust the plan',
            author: 'Qanon',
            url: 'www.totallyarealplace.org',
            likes: 777
        }

        const auth = await api
            .post('/api/login')
            .send({
                username: 'Q',
                password: 'test'
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const patchRes = await api
            .patch(`/api/blogs/${authQanonId}`)
            .set('Authorization', `bearer ${auth.body.token.toString()}`)
            .send(newQanon)
            .expect(202)
            .expect('Content-Type', /application\/json/)

        const getObjectAfterPatch  = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(getObjectAfterPatch.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining(
                    {
                        title: 'Trust the plan',
                        author: 'Qanon',
                        url: 'www.totallyarealplace.org',
                        likes: 777
                    })
            ])
        )
    })

    test('Wrong user cant modify blogs', async () => {
        const auth = await api
            .post('/api/login')
            .send({
                username: 'Male Man',
                password: 'test2'
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogToModify = await Blog.findOne({ title: 'Trust the plan' })

        const newBlog = {
            title: 'Trust the plan',
            author: 'Qanon',
            url: 'www.totallyarealplace.org',
            likes: 777
        }

        const modifyObject = await api
            .delete(`/api/blogs/${blogToModify._id}`)
            .set('Authorization', `bearer ${auth.body.token.toString()}`)
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        expect(modifyObject.body).toEqual({ error: 'invalid user' })
    })
})

afterAll(() => {
    mongoose.connection.close()
})