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
    const postTestObject = {
        title: 'Sending post requests',
        author: 'Test man',
        url: 'Someplacemagical',
        likes: 9000
    }

    const postTestObjectMissingLikes = {
        title: 'Sending post requests without likes',
        author: 'Medicine man',
        url: 'NotHere.org'
    }

    const postTestObjectMissingTitle = {
        author: 'Presidude',
        url: 'NotHere.org'
    }

    const postTestObjectMissingUrl = {
        title: 'Forgetting to put urls',
        author: 'Male Man man',
        likes: 3
    }

    test('POST returns right body', async () => {
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

    test('POSTing blogs without title or url result in status 400 bad request', async () => {
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
    })
})

describe( 'API_DELETE_test', () => {
    test('GET less blogs after delete', async () => {
        const getObject  = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        console.log('getObject.bodyAAAAAAAAAAAAAAAAAAAAAAAA :>> ', api.json(getObject.body) )

        //expect(getObject.body.lenght).toBe(1)

        const getId1 = getObject.body[1].id

        const deleteObject = await api
            .delete(`/api/blogs/${getId1}`)
            .expect(202)

        const getObjectAfterDel  = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        //expect(getObjectAfterDel.body.lenght).toBe(1)
    })
})

afterAll(() => {
    mongoose.connection.close()
})