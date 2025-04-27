const multer = require('multer');
const path = require('path');
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middlewares/authMiddleware');

const uploadDir = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

router.post('/', auth, upload.array('files'), messageController.sendMessage);
router.get('/files/:filename', auth, messageController.getFile); // Removed upload middleware here
router.get('/:chatId', auth, messageController.getChatMessages);

module.exports = router;