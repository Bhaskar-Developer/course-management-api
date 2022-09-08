const express = require('express')
const router = express.Router()

const { createCourse } = require('../controllers/course.controller')
const { protectRoute, authorize } = require('../middlewares/auth')

router.post('/', protectRoute, authorize('admin'), createCourse)

module.exports = router