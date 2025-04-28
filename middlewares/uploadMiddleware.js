// uploadMiddleware.js
const multer = require('multer');
const path = require('path');

const uploadDir = path.join(__dirname, '../uploads');
const BASE_URL = process.env.BASE_URL || 'http://jedel-jardem.space';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const filename = uniqueSuffix + ext;
        cb(null, filename);
    }
});

const upload = multer({ storage });

module.exports = upload;
