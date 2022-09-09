const express = require('express')
const router = express.Router()

const { createCourse, deleteCourse, getCourses, getCourse, approveCourses, addFilesToCourse } = require('../controllers/course.controller')
const { protectRoute, authorize } = require('../middlewares/auth')
const { filesCheck } = require('../middlewares/checkFile')

router.post('/', protectRoute, authorize('admin'), createCourse)
router.get('/', protectRoute, getCourses)
router.get('/:id', protectRoute, getCourse)
router.delete('/:id', protectRoute, authorize('admin'), deleteCourse)
router.patch('/approve', protectRoute, authorize('superadmin'), approveCourses)
router.post('/files', protectRoute, authorize('admin'), filesCheck, addFilesToCourse)

module.exports = router