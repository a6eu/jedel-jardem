const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://77.246.247.4:27017")
        console.log('✅ MongoDB Connected Successfully')
    } catch (error) {
        console.error('❌ MongoDB Connection Failed:', error)
        process.exit(1)
    }
}

module.exports = connectDB
