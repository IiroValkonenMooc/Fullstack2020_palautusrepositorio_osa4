const app = require('./app')
const http = require('http')
const confiq = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(confiq.port, () => {
    logger.info(`server runnin on port ${confiq.port}`)
})