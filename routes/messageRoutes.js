const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middlewares/authMiddleware');
const multer  = require('../multer')

router.post('/', auth, multer.array('files'), messageController.sendMessage);
router.get('/files/:filename', messageController.getFile);
router.get('/:chatId', auth, messageController.getChatMessages);

module.exports = router;