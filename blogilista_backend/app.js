const confiq = require('./utils/config')
const express = require('express')
const middleware = require('./utils/middleware')
const app = express()
require('express-async-errors')
const blogsRouter = require('./controllers/blogsRouter')
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')

logger.info('Connecting to', confiq.mongoDbUrl)

mongoose.connect(confiq.mongoDbUrl,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB', error.message)
    })

app.use(cors())
//app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app