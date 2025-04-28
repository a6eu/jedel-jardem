const Message = require('../models/Message');
const Chat = require('../models/Chat');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

exports.sendMessage = async (req, res) => {
    try {
        const { chatId, text } = req.body;
        const files = req.files || [];



        const fileData = files.map(file => ({
            url: `/api/messages/files/${file.filename}`,
            mimeType: file.mimetype,
            originalName: file.originalname,
            size: file.size
        }));

        const message = await Message.create({
            chat: chatId,
            sender: req.user.id,
            text: text || null,
            files: fileData.length > 0 ? fileData : null
        });

        await Chat.findByIdAndUpdate(chatId, {
            lastMessage: text || (fileData.length > 0 ? 'File sent' : '')
        });

        res.status(201).json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getChatMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
          .populate('sender', '_id name avatar')
          .sort({ createdAt: 1 })
          .lean();

        const messagesWithIsMine = messages.map(message => ({
            ...message,
            isMine: message.sender._id.toString() === req.user.id
        }));

        res.json(messagesWithIsMine);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getFile = async (req, res) => {
    try {
        const { filename } = req.params;


        const message = await Message.findOne({ 'files.url': `/api/files/${filename}` });

        if (!message) {
            return res.status(404).json({ message: 'File not found in any message' });
        }

        const file = message.files.find(f => f.url === `/api/files/${filename}`);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        const filePath = path.join(__dirname, '..', 'uploads', filename);

        res.download(filePath);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
