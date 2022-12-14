const path = require('path')
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileUpload = require('express-fileupload')
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error')

// Load Env Variables
dotenv.config({ path: `${path.resolve()}/config/config.env` })

//Connect to MongoDB
connectDB()

//Load Route Files
const user = require('./routes/user.route')
const course = require('./routes/course.route')
const enrollment = require('./routes/enrollment.route')

// Create App
// This will be later separated into a separate folder
const app = express()

// Use public directory path
app.use(express.static(path.join(__dirname, process.env.FILE_UPLOAD_PATH)))

// Use File uploader
app.use(fileUpload({
  createParentPath: true
}));

// Use Morgin for logging requests
app.use(morgan('dev'))

// Use Body Parser
app.use(express.json())

// Mount Routes
app.use('/api/v1/users', user)
app.use('/api/v1/courses', course)
app.use('/api/v1/enrollments', enrollment)

// Use Custom Error Handler
app.use(errorHandler)

const server = app.listen(
  process.env.PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on Port ${process.env.PORT}`)
)

//Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err}`)
  //Crash the Application i.e. close server and exit application
  server.close(() => process.exit(1))
})

