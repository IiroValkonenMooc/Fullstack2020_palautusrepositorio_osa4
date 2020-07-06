const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blogModel')
const User = require('../models/userModel')

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

const testUser = {
    name: 'Qanon',
    username: 'Q',
    password: 'test'
}

let testUserId = undefined

beforeEach( async () => {
    await User.deleteMany({})
    const userObject = new User(testUser)
    await userObject.save()

    await Blog.deleteMany({})

    const defUser = await User.findOne({ username: 'Q' })
    testUserId = defUser._id


    for (let blog of initialBloglist) {
        blog.user = defUser._id
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
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


    test.only('POST returns right body', async () => {
        postTestObject.user = testUserId

        const retObject = await api
            .post('/api/blogs')
            .send(postTestObject)

        expect(retObject.body).toHaveProperty('title', 'Sending post requests')
        expect(retObject.body).toHaveProperty('author', 'Test man')
        expect(retObject.body).toHaveProperty('url', 'Someplacemagical')
        expect(retObject.body).toHaveProperty('likes', 9000)
    })

    test('POSTed object can be found with GET', async () => {
        const retObject = await api
            .post('/api/blogs')
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
        const retObject = await api
            .post('/api/blogs')
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
        const retObject = await api
            .post('/api/blogs')
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
        const retObjectNoTitle = await api
            .post('/api/blogs')
            .send(postTestObjectMissingTitle)
            .expect(400)

        expect(retObjectNoTitle.status).toBe(400)

        const retObjectNoUrl = await api
            .post('/api/blogs')
            .send(postTestObjectMissingUrl)
            .expect(400)

        expect(retObjectNoUrl.status).toBe(400)

        const retObjectNoUser = await api
            .post('/api/blogs')
            .send(postTestObjectMissingUser)
            .expect(400)

        expect(retObjectNoUrl.status).toBe(400)
    })
})

describe( 'API_DELETE_test', () => {
    test('Secon testblog gets removed', async () => {
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

        const deleteObject = await api
            .delete(`/api/blogs/${authQanonId}`)
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

        const patchRes = await api
            .patch(`/api/blogs/${authQanonId}`)
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

})

afterAll(() => {
    mongoose.connection.close()
})