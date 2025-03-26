const User = require('../models/User')

const multer = require('multer')
const {bucket} = require('../firebase')

const upload = multer({storage: multer.memoryStorage()}).single('avatar')

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password')
        res.json(users)
    } catch (error) {
        res.status(500).json({message: 'Server error'})
    }
}

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        if (!user) {
            return res.status(404).json({message: 'User not found'})
        }
        console.log(req.user.id)
        res.json(user)
    } catch (error) {
        res.status(500).json({message: 'Server error'})
    }
}

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password')
        if (!user) return res.status(404).json({message: 'User not found'})
        res.json(user)
    } catch (error) {
        res.status(500).json({message: 'Server error'})
    }
}

exports.updateUser = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err)
                return res.status(500).json({message: 'File upload error'})

            let avatarUrl
            if (req.file) {
                const file = bucket.file(
                    `avatars/${Date.now()}-${req.file.originalname}`
                )
                await file.save(req.file.buffer, {
                    contentType: req.file.mimetype,
                })
                avatarUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`
            }

            const {name, phoneNumber, role, specialisation, birthYear} =
                req.body

            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    name,
                    phoneNumber,
                    role,
                    specialisation,
                    birthYear,
                    ...(avatarUrl && {avatarUrl}),
                },
                {new: true, runValidators: true}
            ).select('-password')

            if (!updatedUser) {
                return res.status(404).json({message: 'User not found'})
            }

            res.json(updatedUser)
        })
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message})
    }
}

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.json({message: 'User deleted'})
    } catch (error) {
        res.status(500).json({message: 'Server error'})
    }
}
