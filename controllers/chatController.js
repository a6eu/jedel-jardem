const Chat = require('../models/Chat');

exports.createChat = async (req, res) => {
    const {userId} = req.body;
    const currentUserId = req.user.id;

    try {
        let chat = await Chat.findOne({members: {$all: [currentUserId, userId], $size: 2}});

        if (chat) {
            return res.status(200).json(chat);
        }

        chat = await Chat.create({members: [currentUserId, userId]});

        res.status(201).json(chat);
    } catch (err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

exports.getUserChats = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        const chats = await Chat.find({members: currentUserId})
            .populate('members', '-password');

        const chatsWithRecipient = chats.map(chat => {
            const recipient = chat.members.find(member => member._id.toString() !== currentUserId);
            return {
                ...chat.toObject(),
                recipient
            };
        });

        res.json(chatsWithRecipient);
    } catch (err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

exports.getChatById = async (req, res) => {
    try {
        const chatId = req.params.id;
        const currentUserId = req.user.id.toString();

        const chat = await Chat.findById(chatId).populate('members', '-password');

        if (!chat) {
            return res.status(404).json({message: 'Chat not found'});
        }

        if (!chat.members || chat.members.length !== 2) {
            return res.status(400).json({message: 'Chat does not have exactly two members'});
        }

        const me = chat.members.find(m => m._id.toString() === currentUserId);
        const recipient = chat.members.find(m => m._id.toString() !== currentUserId);

        res.status(200).json({
            _id: chat._id,
            me,
            recipient,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
};
