require('dotenv').config()

const mongoDbUrl = process.env.MONGODB_URI
const port = process.env.PORT

module.exports = {
    mongoDbUrl,
    port
}