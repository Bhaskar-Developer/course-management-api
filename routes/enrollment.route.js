const express = require('express')
const router = express.Router()

const { createEnrollment, getEnrollments } = require('../controllers/enrollment.controller')
const { protectRoute, authorize } = require('../middlewares/auth')

router.post('/', protectRoute, authorize('employee'), createEnrollment)
router.get('/', protectRoute, authorize('employee'), getEnrollments)


module.exports = router