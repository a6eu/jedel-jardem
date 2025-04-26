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
        company: {type: String},
        bio: {type: String},
        patientData: {
            bloodType: {type: String, default: ''},
            weight: {type: String, default: ''},
            height: {type: String, default: ''},
            illnessHistory: [{
                type: String, default: ''
            }],
            allergies: [{type: String, default: ''}],
        },
        reviews: [{type: Number}]
    },
    {timestamps: true}
)

module.exports = mongoose.model('User', UserSchema)
