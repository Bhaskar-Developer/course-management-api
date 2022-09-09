const mongoose = require('mongoose')

const TopicsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add topic name']
  },
  duration: {
    type: Number,
    required: [true, 'Please add topic duration']
  },
  videoUrl: {
    type: String,
    required: [true, 'Please specify video Url for topic']
  },
  progress: {
    type: Number,
    default: 0.0
  }
})

const EnrollmentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  topics: {
    type: [TopicsSchema]
  },
  totalDuration: {
    type: Number,
    required: [true, 'Please specify course total duration']
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedPercentage: {
    type: Number,
    default: 0.0
  }
})

module.exports = mongoose.model('Enrollment', EnrollmentSchema)