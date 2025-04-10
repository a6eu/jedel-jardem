const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
    const {chatId, text} = req.body;

    try {
        const message = await Message.create({
            chat: chatId,
            sender: req.user.id,
            text,
        });

        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

exports.getChatMessages = async (req, res) => {
    try {
        const messages = await Message.find({chat: req.params.chatId}).populate('sender', 'name');
        res.json(messages);
    } catch (err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};
