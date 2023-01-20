const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, validate, validateRegister } = require('../models/user')
const { Post } = require('../models/post')
const auth = require('../middleware/auth')
const moment = require('moment')
require('dotenv').config()

router.post('/', auth, async (req, res) => {
  const isValidId = mongoose.Types.ObjectId.isValid(req.user._id)
  if (!isValidId) return res.status(400).send('Invalid Id')

  const user = await User.findOne({ _id: req.user._id }).select('-password')
  if (!user) return res.status(400).send('User not found')
  res.status(200).send(user)
})

router.post('/login', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const user = await User.findOneAndUpdate(
    {
      username: req.body.username,
    },
    { lastTimeSeen: moment().format('LLL') }
  )

  if (!user) return res.status(400).send('Wrong username or password')

  if (user.status === 'Blocked')
    return res.status(403).send('This user is blocked')

  const isValidPassword = await bcrypt.compare(req.body.password, user.password)
  if (!isValidPassword)
    return res.status(400).send('Wrong username or password')

  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY)
  res.status(200).send({ token, userId: user._id })
})

router.post('/register', async (req, res) => {
  const { error } = validateRegister(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let availableUsername = await User.findOne({ username: req.body.username })
  try {
    // Checking for username is it unique or not
    if (availableUsername) {
      res.status(400).send('This user is already signed in !')
    }

    const user = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      regisTime: new Date()
        .toISOString()
        .replace('-', '/')
        .split('T')[0]
        .replace('-', '/')
        .toString(),
      lastTimeSeen: moment().format('LLL'),
      avatar: '',
      bio: '',
      workplace: '',
      hobbies: '',
      address: '',
      status: 'Active',
      followings: [],
      followers: [],
    })
    // Hashing password
    const salt = await bcrypt.genSalt()
    user.password = await bcrypt.hash(user.password, salt)
    await user.save()

    // Generating token and sending it
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY)
    res.status(200).send({ token, userId: user._id })
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get('/left', auth, async (req, res) => {
  await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      lastTimeSeen: moment().format('LLL'),
    }
  )
  res.status(200).send('user left')
})

router.get('/online', auth, async (req, res) => {
  await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      lastTimeSeen: 'Online',
    }
  )
  res.status(200).send('user is online')
})

router.get('/check', auth, async (req, res) => {
  const isValidId = mongoose.Types.ObjectId.isValid(req.user._id)
  if (!isValidId) return res.status(400).send('Invalid ID')

  const user = await User.findOne({ _id: req.user._id })
  user
    ? res.status(200).send('Available user')
    : res.status(400).send('Unavailable user')
})

router.get('/:id', async (req, res) => {
  const user = await User.findOne({ username: req.params.id }).select(
    '-password'
  )
  user ? res.status(200).send(user) : res.status(400).send('Unavailable user')
})

router.get('/delete/:id', async (req, res) => {
  const isValidId = mongoose.Types.ObjectId.isValid(req.params.id)
  if (!isValidId) return res.status(400).send('Invalid ID')

  await User.findOneAndDelete({ _id: req.params.id })
  await Post.deleteMany({ 'author._id': req.params.id })

  res.status(200).send('Deleted successfully')
})

module.exports = router
