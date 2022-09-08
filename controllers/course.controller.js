
const Course = require('../models/Course')
const asyncHandler = require('../middlewares/async')
const errorResponse = require('../utils/errorResponse')


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