const express = require('express')
const router = express.Router()

const { createEnrollment } = require('../controllers/enrollment.controller')
const { protectRoute, authorize } = require('../middlewares/auth')

router.post('/', protectRoute, authorize('employee'), createEnrollment)


module.exports = router