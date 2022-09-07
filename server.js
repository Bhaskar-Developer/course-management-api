const path = require('path')
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');



// Load Env Variables
dotenv.config({ path: `${path.resolve()}/config/config.env` })

//Connect to MongoDB
connectDB()

// Create App
// This will be later separated into a separate folder
const app = express()

app.use(morgan('dev'))

app.get('/test', (req, res) => {
  res.json({
    data: {},
    message: "Server is Running"
  })
})

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

