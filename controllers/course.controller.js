
const Course = require('../models/Course')
const asyncHandler = require('../middlewares/async')
const errorResponse = require('../utils/errorResponse')

//@desc     GET All Courses
//@route    GET /api/v1/courses
//@access   Private
exports.getCourses = asyncHandler(async (req, res, next) => {
  // If the user accessing this route is employee then show only approved courses
  // If the user accessing the route is super admin or admin then show all courses

  let courses = []
  let totalCount = 0

  // Pagination Configuration
  const page = req.query.page !== undefined ? parseInt(req.query.page) : 1
  const limit = 20
  const offset = limit * (page - 1)

  if (req.user.role === 'employee') {
    if (req.query.sort) {
      if (req.query.sort === 'category') {
        Course.find({ approved: true }).limit(limit).skip(offset).sort({ "category": 1 }).exec(function (err, data) {
          if (err) {
            console.log(err)
            return next(new errorResponse(`Something went wrong`, 500))
          }
          courses = data
        })
      }

      if (req.query.sort === '-category') {
        Course.find({ approved: true }).limit(limit).skip(offset).sort({ "category": -1 }).exec(function (err, data) {
          if (err) {
            console.log(err)
            return next(new errorResponse(`Something went wrong`, 500))
          }
          courses = data
        })
      }
    } else {
      courses = await Course.find({ approved: true }).limit(limit).skip(offset)
    }
    totalCount = await Course.find({ approved: true }).countDocuments()
  } else {
    courses = await Course.find({}).limit(limit).skip(offset)
    totalCount = await Course.find({}).countDocuments()
  }

  res.status(200).json({
    success: true,
    meta: {
      page_size: limit,
      current_page: page,
      total_pages: Math.ceil(totalCount / limit)
    },
    data: courses,
    message: "Courses were fetched successfully."
  })
})

//@desc     GET Single Course
//@route    GET /api/v1/courses/:id
//@access   Private
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id)

  //if the course does not exist then return a 404 error
  if (!course) {
    return next(new errorResponse(`Course not found with the id of ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: course,
    message: "Course was fetched successfully."
  })
})

//@desc     Add New Course
//@route    POST /api/v1/courses
//@access   Private
exports.createCourse = asyncHandler(async (req, res, next) => {
  //get the user details from the request body
  const { title, description, category, topics } = req.body
  // set the user who created this course
  // req.body.user = req.user.id

  //Save the course to the Database
  const course = await Course.create({
    title,
    description,
    category,
    topics,
    user: req.user.id
  })
  // console.log(course)

  res.status(200).json({
    success: true,
    message: "Course was sucessfully created."
  })
})


//@desc     Delete a Course
//@route    DELETE /api/v1/courses/:id
//@access   Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  //check if the course to be deleted exists in the database
  const course = await Course.findById(req.params.id)

  //if the course does not exist then return a 404 error
  if (!course) {
    return next(new errorResponse(`Course not found with the id of ${req.params.id}`, 404))
  }

  // Admins can delete only the courses that were created by them.
  if (course.user.toString() !== req.user.id) {
    return next(new errorResponse(`User with id ${req.user.id} is not authorized to delete course with id ${course._id}`, 401))
  }

  // Delete the course
  await course.remove()

  res.status(200).json({
    success: true,
    message: 'Course was successfully deleted.'
  })
})

//@desc     Approve One or Multiple Courses
//@route    PATCH /api/v1/courses/approve
//@access   Private
exports.approveCourses = asyncHandler(async (req, res, next) => {
  const coursesToApprove = req.body.courses

  // make sure courses are specified
  if (!coursesToApprove) {
    return next(new errorResponse(`Please specify single or multiple courses approve`, 400))
  }

  if (Array.isArray(coursesToApprove) && coursesToApprove.length > 0) {
    // Approve single or multiple courses
    await Course.updateMany({ _id: { $in: coursesToApprove } }, { approved: true })
  }

  res.status(200).json({
    success: true,
    message: 'Specified courses were successfully approved.'
  })
})