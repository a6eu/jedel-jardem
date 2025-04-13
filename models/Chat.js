const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    lastMessage: {type: String, default: ""},
    alert: {type: mongoose.Schema.Types.ObjectId, ref: 'Alert'},
    createdAt: {type: Date},
    updatedAt: {type: Date}
}, {timestamps: true});

module.exports = mongoose.model('Chat', ChatSchema);
