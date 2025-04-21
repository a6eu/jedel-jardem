const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middlewares/authMiddleware');
const upload = require("../multer");

router.post('/', auth, upload.array('files'), messageController.sendMessage);
router.get('/:chatId', auth, messageController.getChatMessages);

module.exports = router;
