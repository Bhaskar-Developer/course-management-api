const Enrollment = require('../models/Enrollment')
const Course = require('../models/Course')
const asyncHandler = require('../middlewares/async')
const errorResponse = require('../utils/errorResponse')

//@desc     Add New Enrollment
//@route    POST /api/v1/enrollments
//@access   Private
exports.createEnrollment = asyncHandler(async (req, res, next) => {
  // check if course id is specified in request body
  if (!req.body.courseId) {
    return next(new errorResponse(`Please specify course id`, 400))
  }

  // Check if course exists
  const course = await Course.findOne({ _id: req.body.courseId })
  if (!course) {
    return next(new errorResponse(`Course not found with id ${req.body.courseId}`, 404))
  }

  // check if user has already enrolled for this course
  const isExists = await Enrollment.findOne({ user: req.user.id, courseId: req.body.courseId })
  if (isExists) {
    return next(new errorResponse(`User has already enrolled for this course.`, 409))
  }

  // Create new Enrollment
  const newEnrollment = {
    courseId: req.body.courseId,
    user: req.user.id,
    topics: course.topics,
    totalDuration: course.totalDuration
  }

  await Enrollment.create(newEnrollment)

  res.status(200).json({
    success: true,
    message: "User successfully enrolled to course."
  })
})