const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: 'Unauthorized'})
    }

    const token = authHeader.split(' ')[1]

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET)
        console.log(req.user.id);

        next()
    } catch (error) {
        return res.status(401).json({message: 'Invalid token'})
    }
}

module.exports = authMiddleware
