const Chat = require('../models/Chat');

exports.createChat = async (req, res) => {
    const {userId} = req.body;
    const currentUserId = req.user.id;

    try {
        let chat = await Chat.findOne({members: {$all: [currentUserId, userId]}});

        if (!chat) {
            chat = await Chat.create({members: [currentUserId, userId]});
        }

        res.status(201).json(chat);
    } catch (err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

exports.getUserChats = async (req, res) => {
    try {
        const chats = await Chat.find({members: req.user.id}).populate('members', '-password');
        res.json(chats);
    } catch (err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};
