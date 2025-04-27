const Message = require('../models/Message');
const Chat = require('../models/Chat');
const fs = require('fs');
const path = require('path');

exports.sendMessage = async (req, res) => {
    const { chatId, text } = req.body;

    try {
        let files = [];
        if (req.files && req.files.length > 0) {
            files = req.files.map(file => ({
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                path: file.path,
                filename: file.filename
            }));
        }

        const message = await Message.create({
            chat: chatId,
            sender: req.user.id,
            text: text || null,
            files: files.length > 0 ? files : null,
        });

        await Chat.findByIdAndUpdate(chatId, {
            lastMessage: text || (files.length > 0 ? 'File sent' : '')
        });

        res.status(201).json(message);
    } catch (err) {
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                fs.unlink(file.path, () => {});
            });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getChatMessages = async (req, res) => {
    try {
        const userId = req.user.id;

        const messages = await Message.find({ chat: req.params.chatId })
          .populate('sender', '_id name avatar')
          .lean();

        const messagesWithIsMine = messages.map(message => {
            let files = null;
            if (message.files && message.files.length > 0) {
                files = message.files.map(file => {
                    try {
                        const filePath = path.join(__dirname, '..', file.path);
                        const fileData = fs.readFileSync(filePath);
                        return {
                            ...file,
                            base64: fileData.toString('base64'),
                            url: `/api/files/${file.filename}`
                        };
                    } catch (err) {
                        console.error('Error reading file:', err);
                        return null;
                    }
                }).filter(Boolean);
            }

            return {
                ...message,
                files,
                isMine: message.sender ? message.sender._id.toString() === userId : false,
            };
        });

        res.json(messagesWithIsMine);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getFile = async (req, res) => {
    try {
        const file = await Message.findOne(
          { 'files.filename': req.params.filename },
          { 'files.$': 1 }
        );

        if (!file || !file.files || file.files.length === 0) {
            return res.status(404).json({ message: 'File not found' });
        }

        const fileData = file.files[0];
        const filePath = path.join(__dirname, '..', fileData.path);

        res.setHeader('Content-Type', fileData.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename=${fileData.originalName}`);

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};