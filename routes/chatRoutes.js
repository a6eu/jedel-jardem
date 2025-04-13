const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, chatController.createChat);
router.get('/', auth, chatController.getUserChats);
router.get('/:id', auth, chatController.getChatById);

module.exports = router;
