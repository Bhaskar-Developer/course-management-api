const errorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {
  //assign all properties on err to the error object
  let error = { ...err }
  error.message = err.message

  console.log('Error: ', err.message)

  //Mongoose Bad ObjectId error
  if (err.name === 'CastError') {
    const message = `Resource not found`
    error = new errorResponse(message, 404)
  }

  //Duplicate email, id error
  if (err.code === 11000) {
    if (err.keyPattern.email === 1) {
      error = new errorResponse('User already exists with this email', 400)
    } else {
      error = new errorResponse('Duplicate Key error', 400)
    }
  }

  //Validation error. This will run if data is inserted into database without the required fields
  if (err.name === 'ValidationError') {
    //collect and store all validator error messages in message and send it to the errorResponse
    const message = Object.values(err.errors).map(val => val.message)
    error = new errorResponse(message, 400)
  }

  res.status(error.statusCode || 500).send({
    success: false,
    error: error.message || 'Server Error'
  })
}

module.exports = errorHandler