const Message = require('../models/Message');
const Chat = require('../models/Chat');

exports.sendMessage = async (req, res) => {
    const {chatId, text, files} = req.body;

    try {
        const message = await Message.create({
            chat: chatId,
            sender: req.user.id,
            text,
            files,
        });

        await Chat.findByIdAndUpdate(
            chatId,
            {
                lastMessage: text
            }
        )

        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

exports.getChatMessages = async (req, res) => {
    try {
        const userId = req.user.id;

        const messages = await Message.find({chat: req.params.chatId})
            .populate('sender', 'name');

        const messagesWithIsMine = messages.map(message => ({
            ...message.toObject(),
            isMine: message.sender._id.toString() === userId
        }));

        res.json(messagesWithIsMine);
    } catch (err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};