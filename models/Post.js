const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema(
    {
        title: {type: String, required: true},
        description: {type: String, required: true},
        images: [{type: String}],
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {type: String, enum: ['new', 'closed', 'chat'], default: 'new'},
    },
    {timestamps: true}
)

module.exports = mongoose.model('Post', PostSchema)
