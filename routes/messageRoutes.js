const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middlewares/authMiddleware');
const upload  = require('../middlewares/uploadMiddleware');

router.post('/', auth, upload.single('files'), messageController.sendMessage);
router.get('/files/:filename', messageController.getFile);
router.get('/:chatId', auth, messageController.getChatMessages);

module.exports = router;