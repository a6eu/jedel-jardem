const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    const {name, email, password, role, gender, company, location} = req.body
    try {
        let user = await User.findOne({email})
        if (user)
            return res.status(400).json({message: 'User already exists'})

        const hashedPassword = await bcrypt.hash(password, 10)
        user = new User({
            name,
            email,
            gender,
            company,
            password: hashedPassword,
            role,
            location
        })

        await user.save()
        res.status(201).json({message: 'User registered'})
    } catch (error) {
        console.error('Registration Error:', error)
        res.status(500).json({message: 'Server error', error: error.message})
    }
}

exports.login = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({message: 'Invalid credentials'})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({message: 'Invalid credentials'})
        }
        const accessToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '30d',
        })

        res.json({
            access: accessToken,
            message: 'Logged in',
        })
    } catch (error) {
        res.status(500).json({message: 'Server error'})
    }
}
