
const Course = require('../models/Course')
const asyncHandler = require('../middlewares/async')


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