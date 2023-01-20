const Joi = require('joi')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  username: {
    type: String,
    trim: true,
    min: 1,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 1,
  },
  avatar: {
    type: String,
  },
  bio: {
    type: String,
  },
  workplace: {
    type: String,
    trim: true,
  },
  hobbies: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
  },
  followings: {
    type: Array,
    required: true,
  },
  followers: {
    type: Array,
    required: true,
  },
  regisTime: {
    type: String,
  },
  lastTimeSeen: { type: String },
  status: { type: String },
})

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, 'iTsMyPriVatEkEy')
  return token
}

const User = mongoose.model('User', userSchema)

function validateRegister(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    username: Joi.string().min(3).trim().required(),
    password: Joi.string().min(1).trim().required(),
    email: Joi.string().email().required(),
  })

  return schema.validate(user)
}

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(1).max(15).trim().required(),
    password: Joi.string().min(1).max(255).required(),
  })

  return schema.validate(user)
}

function validateUpdatedUser(user) {
  const schema = Joi.object({
    _id: mongoose.Types.ObjectId,
    username: Joi.string().min(1).max(15).trim().required(),
    workplace: Joi.string().required().min(3),
    address: Joi.string().required(),
    hobbies: Joi.string().required(),
    bio: Joi.string(),
    avatar: Joi.string().required(),
  })

  return schema.validate(user)
}

function validateUsername(updatedUser, userInDb) {
  return updatedUser.username === userInDb.username &&
    updatedUser._id === userInDb._id
    ? true
    : false
}

exports.User = User
exports.validate = validateUser
exports.validateUpdates = validateUpdatedUser
exports.validateUsername = validateUsername
exports.validateRegister = validateRegister
