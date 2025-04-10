const express = require('express')
const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser, getMe,
} = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, getUsers)

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Successfully retrieved user data
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authMiddleware, getUserById)

/**
 * @swagger
 * /api/users:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               gender:
 *                  type: string
 *               role:
 *                 type: string
 *               specialisation:
 *                 type: string
 *               birthYear:
 *                 type: string
 *                 format: date
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successfully updated user
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('', authMiddleware, updateUser)

/**
 * @swagger
 * /api/users:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Successfully deleted user
 *       500:
 *         description: Server error
 */
router.delete('', authMiddleware, deleteUser)

router.get('/me', authMiddleware, getMe)

module.exports = router
