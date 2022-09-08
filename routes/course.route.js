const express = require('express')
const router = express.Router()

const { createCourse, deleteCourse } = require('../controllers/course.controller')
const { protectRoute, authorize } = require('../middlewares/auth')

router.post('/', protectRoute, authorize('admin'), createCourse)
router.delete('/:id', protectRoute, authorize('admin'), deleteCourse)

module.exports = router