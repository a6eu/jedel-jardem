require('dotenv').config()
const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const swaggerDocs = require('./swagger.js')

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')

const app = express()
connectDB()

app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

swaggerDocs(app)

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
