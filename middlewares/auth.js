const jwt = require('jsonwebtoken')
const asyncHandler = require('./async')
const errorResponse = require('../utils/errorResponse')
const User = require('../models/User')

//Protect routes that require authentication
exports.protectRoute = asyncHandler(async (req, res, next) => {
  let token

  //check if the token is set in the Authorization header.
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // get token
    token = req.headers.authorization.split(' ')[1]
  }

  //if token is null then return an error
  if (!token) {
    return next(new errorResponse('Not authorized to access this route', 401))
  }

  //Verify the token
  try {
    //decode the token and get the userId
    const decodedData = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decodedData.id).select('name email role _id')
    req.token = token
    next()
  } catch (error) {
    return next(new errorResponse('Not authorized to access this route', 401))
  }
})

//Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new errorResponse(`User with role ${req.user.role} is not authorized to access this route`, 403))
    }
    next()
  }
}