const express = require('express')
const router = express.Router()

const { createEnrollment, getEnrollments, getEnrollment, updateEnrollment } = require('../controllers/enrollment.controller')
const { protectRoute, authorize } = require('../middlewares/auth')

router.post('/', protectRoute, authorize('employee'), createEnrollment)
router.get('/', protectRoute, authorize('employee'), getEnrollments)
router.get('/:enrollmentId', protectRoute, authorize('employee'), getEnrollment)
router.patch('/', protectRoute, authorize('employee'), updateEnrollment)


module.exports = router