const mongoose = require('mongoose')
const { getVideoDurationInSeconds } = require('get-video-duration');

const TopicsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add topic name']
  },
  duration: {
    type: Number
  },
  videoUrl: {
    type: String,
    required: [true, 'Please specify video Url for topic']
  }
})

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add title']
  },
  description: {
    type: String,
    required: [true, 'Please add description']
  },
  totalDuration: {
    type: Number,
  },
  category: {
    type: String,
    required: [true, 'Please add category'],
  },
  topics: {
    type: [TopicsSchema],
    validate: v => Array.isArray(v) && v.length > 0
  },
  approved: {
    type: Boolean,
    default: false
  },
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

CourseSchema.pre('save', async function (next) {
  const course = this //this is the current course that is about to be saved

  // calculate duration of each topic in course and total duration of this course
  course.totalDuration = 0.0;
  for (let i = 0; i <= course.topics.length - 1; i++) {
    course.topics[i].duration = await getVideoDurationInSeconds(course.topics[i].videoUrl)
    // console.log("Topic Duration: ", course.topics[i].duration)
    course.totalDuration += course.topics[i].duration
  }

  next()
})


module.exports = mongoose.model('Course', CourseSchema)