require('dotenv').config()

let mongoDbUrl = process.env.MONGODB_URI
const port = process.env.PORT

if(process.env.NODE_ENV === 'test'){
    mongoDbUrl = process.env.MONGODB_URI_TEST
}

module.exports = {
    mongoDbUrl,
    port
}