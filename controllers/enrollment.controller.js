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

//@desc     GET All Enrollments
//@route    GET /api/v1/enrollments
//@access   Private
exports.getEnrollments = asyncHandler(async (req, res, next) => {
  // Pagination Configuration
  const page = req.query.page !== undefined ? parseInt(req.query.page) : 1
  const limit = 20
  const offset = limit * (page - 1)

  // get the courses that the user has enrolled into
  const enrollmentsOfUser = await Enrollment.find({ user: req.user.id }).limit(limit).skip(offset)
  const totalCount = await Enrollment.find({ user: req.user.id }).countDocuments()

  res.status(200).json({
    success: true,
    meta: {
      page_size: limit,
      current_page: page,
      total_pages: Math.ceil(totalCount / limit)
    },
    data: enrollmentsOfUser,
    message: "Enrolled courses successfully fetched."
  })
})

//@desc     GET Single Enrollment
//@route    GET /api/v1/enrollments/:enrollmentId
//@access   Private
exports.getEnrollment = asyncHandler(async (req, res, next) => {
  // Check if course enrollment exists
  const singleEnrollment = await Enrollment.findOne({ _id: req.params.enrollmentId, user: req.user.id })
  if (!singleEnrollment) {
    return next(new errorResponse(`Enrollment not found with id ${req.params.enrollmentId}`, 404))
  }

  // Return single enrolled course
  res.status(200).json({
    success: true,
    data: singleEnrollment,
    message: "Enrollment was successfully fetched."
  })
})