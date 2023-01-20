const express = require('express')
const auth = require('../middleware/auth')
const router = express.Router()
const { User } = require('../models/user')

router.get('/limited', auth, async (req, res) => {
  const limitedUsers = await User.find({ _id: { $ne: req.user._id } }).limit(
    +req.query.limit
  )
  res.send(limitedUsers)
})

router.get('/', auth, async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select(
    '_id name email lastTimeSeen regisTime status'
  )

  res.send(users)
})

router.post('/block', auth, async (req, res) => {
  const blockedUsers = req.body
  await User.updateMany(
    {
      _id: { $in: blockedUsers },
    },
    { status: 'Blocked' }
  )
  res.status(200).send('Users blocked')
})

router.post('/unblock', auth, async (req, res) => {
  const unblockedUsers = req.body
  await User.updateMany(
    {
      _id: { $in: unblockedUsers },
    },
    { status: 'Active' }
  )
  res.status(200).send('Users unblocked')
})

router.post('/delete', auth, async (req, res) => {
  const deletedUsers = req.body
  await User.deleteMany({
    _id: { $in: deletedUsers },
  })
  res.status(200).send('Users deleted')
})

module.exports = router
