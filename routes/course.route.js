const express = require('express')
const router = express.Router()

const { createCourse } = require('../controllers/course.controller')
const { protectRoute } = require('../middlewares/auth')

router.post('/', protectRoute, createCourse)

module.exports = router