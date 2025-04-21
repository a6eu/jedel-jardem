const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    chat: {type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true},
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    text: {type: String},
    files: [{type: String}],
    createdAt: {type: Date},
    updatedAt: {type: Date},
}, {timestamps: true});

module.exports = mongoose.model('Message', MessageSchema);
