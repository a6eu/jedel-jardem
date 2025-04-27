const Message = require('../models/Message');
const Chat = require('../models/Chat');

exports.sendMessage = async (req, res) => {
    const {chatId, text} = req.body;
    const filePaths = req.files?.map((f) => f.path) || [];

    try {
        const message = await Message.create({
            chat: chatId,
            sender: req.user.id,
            text,
            files: filePaths,
        });

        await Chat.findByIdAndUpdate(chatId, {lastMessage: text});

        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

exports.getChatMessages = async (req, res) => {
    try {
        const userId = req.user.id;

        const messages = await Message.find({ chat: req.params.chatId })
            .populate('sender', '_id')
            .lean();

        const messagesWithIsMine = messages.map(message => ({
            ...message,
            isMine: message.sender ? message.sender._id.toString() === userId : false,
        }));

        res.json({ ...messagesWithIsMine,  });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
