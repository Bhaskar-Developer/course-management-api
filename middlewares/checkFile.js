const asyncHandler = require('./async')
const errorResponse = require('../utils/errorResponse')

//Protect routes that require authentication
exports.filesCheck = asyncHandler(async (req, res, next) => {
  try {
    //check if atleast one file is uploaded
    // console.log("Request Files:", req.files)
    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new errorResponse('Please upload atleast one file', 400))
    }
    // check if files have the allowed mimetype
    req.files.files.map(file => file.mimetype)
    const isValidMimetypes = req.files.files.every(file => process.env.FILES_ALLOWED_MIMETYPE.includes(file.mimetype))
    if (!isValidMimetypes) {
      return next(new errorResponse('Please specify only pdf,word and xls files', 400))
    }
    // check of files size is less than 2MB
    req.files.files.map(file => file.size)
    const isValidFileSize = req.files.files.every(file => file.size <= process.env.MAX_FILE_SIZE)
    if (!isValidFileSize) {
      return next(new errorResponse('File size cannot be larger than 2MB', 400))
    }

    next()
  } catch (error) {
    console.log("Error:", error)
    return next(new errorResponse('Something went wrong', 500))
  }
})