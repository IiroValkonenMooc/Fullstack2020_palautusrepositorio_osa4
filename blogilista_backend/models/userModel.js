const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    passwordHash:{
        type: String,
        //required: true //Hajoaa testauksen aikana jos tehdään tämä validointi. En ymmärrä :(
    },
    addedBlogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)