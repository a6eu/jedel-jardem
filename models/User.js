const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        role: {type: String, required: true},
        gender: {type: String, required: true},
        specialisation: {type: String},
        location: {type: String},
        phone: {type: String},
        birthYear: {type: Date},
        avatarUrl: {type: String},
        password: {type: String, required: true},
        company: {type: String, required: true},
        bio: {type: String},
    },
    {timestamps: true}
)

module.exports = mongoose.model('User', UserSchema)
