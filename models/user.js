const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        require: [true, 'You should provide email'],
        unique: true
    }
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User',UserSchema)