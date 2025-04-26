const express = require('express')
const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getMe,
    reviewUser,
} = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('', authMiddleware, getMe)

router.put('', authMiddleware, updateUser)

router.get('/all', authMiddleware, getUsers)

router.delete('', authMiddleware, deleteUser)

router.get('/everyone', getUsers)

router.post('/review', authMiddleware, reviewUser)

router.get('/:id', authMiddleware, getUserById)


module.exports = router
