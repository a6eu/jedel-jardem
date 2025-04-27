const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String },
    files: [{
        originalName: String,
        mimeType: String,
        size: Number,
        path: String,
        filename: String
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);