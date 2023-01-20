const express = require('express')
const router = express.Router()
const { User, validateUpdates, validateUsername } = require('../models/user')
const { Post } = require('../models/post')

router.post('/', async (req, res) => {
  // Validating request from client
  const { error } = validateUpdates(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // Checking updated username is unique in database and updating user data
  const availableUsername = await User.findOne({ username: req.body.username })
  let posts = await Post.find({ 'author._id': req.body._id })
  try {
    if (availableUsername) {
      if (
        JSON.stringify(req.body._id) === JSON.stringify(availableUsername._id)
      ) {
        await User.updateOne({ _id: req.body._id }, req.body)

        await Post.updateMany(
          { 'author._id': req.body._id },
          {
            'author.username': req.body.username,
            'author.avatar': req.body.avatar,
          }
        )
        res.status(200).send('Updated successfully!')
      } else {
        res.status(400).send('Username is already been taken')
      }
    } else {
      await User.updateOne({ _id: req.body._id }, req.body)
      await Post.updateMany(
        { 'author._id': req.body._id },
        {
          'author.username': req.body.username,
          'author.avatar': req.body.avatar,
        }
      )
      res.status(200).send('Updated successfully!')
    }
  } catch (err) {
    res.status(400).send(err)
  }
})

module.exports = router
