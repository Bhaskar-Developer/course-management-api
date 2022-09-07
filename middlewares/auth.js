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
    console.log(decodedData)
    //check if there is a user with the decoded userId in the database
    //If the user exists then set this as the req.user
    //console.log(decodedData.id)
    req.user = await User.findById(decodedData.id)
    req.token = token
    next()
  } catch (error) {
    return next(new errorResponse('Not authorized to access this route', 401))
  }
})