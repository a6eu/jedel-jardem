const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middlewares/authMiddleware');
const {array} = require("../multer");

router.post('/', auth, array('files'), messageController.sendMessage);
router.get('/:chatId', auth, messageController.getChatMessages);

module.exports = router;
