const express = require('express')
const router = express.Router()

const { createCourse, deleteCourse, getCourses, getCourse, approveCourses } = require('../controllers/course.controller')
const { protectRoute, authorize } = require('../middlewares/auth')

router.post('/', protectRoute, authorize('admin'), createCourse)
router.get('/', protectRoute, getCourses)
router.get('/:id', protectRoute, getCourse)
router.delete('/:id', protectRoute, authorize('admin'), deleteCourse)
router.patch('/approve', protectRoute, authorize('superadmin'), approveCourses)

module.exports = router