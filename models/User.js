const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: [true, 'Email has to be unique'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid Email'
    ]
  },
  role: {
    type: String,
    enum: ['employee', 'admin', 'superadmin'],
    default: 'employee'
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 8,
    select: false
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

//hash the password before saving it to the database
UserSchema.pre('save', async function (next) {
  const user = this //this is the current user that is about to be saved

  //Check if the password has been modified
  //If not, skip the hashing process and go to the next middleware
  if (!user.isModified('password')) {
    return next()
  }

  //Hash the password. 
  //This will run only if password is modified
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  next()
})

//match user entered password(during login) to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  const user = this //this is the current instance of the user
  return await bcrypt.compare(enteredPassword, user.password)
}

//create a signed JWT and return it when a user is registered
UserSchema.methods.getSignedJwtToken = function () {
  const user = this //this is the current instance of the user
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}


module.exports = mongoose.model('User', UserSchema)