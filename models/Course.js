const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course Title']
  },
  description: {
    type: String,
    required: [true, 'Please add description']
  },
  totalDuration: {
    type: Number
  },
  category: {
    type: String,
    required: [true, 'Please specify category'],
  },
  topics: [
    {
      name: {
        type: String,
        required: true
      },
      duration: {
        type: Number,
        required: true
      },
      videoUrl: {
        type: String,
        required: [true, 'Please specify video Url for topic']
      }
    }
  ],
  courseFiles: [
    {
      fileId: {
        type: String
      },
      mimetype: {
        type: String
      },
      filePath: {
        type: String
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
})


module.exports = mongoose.model('Course', CourseSchema)