const express = require('express')
const router = express.Router()
const { Post, validate } = require('../models/post')
const { User } = require('../models/user')
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
  // throw new Error('trouble')
  const posts = await Post.find()
  res.status(200).send(posts)
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const author = await User.findOne({ _id: req.body.authorId })
  if (!author) return res.status(400).send('Invalid author')

  try {
    let post = new Post({
      image: req.body.image,
      description: req.body.description,
      date: req.body.date,
      likes: {
        count: 0,
        usersLiked: [],
      },
      author: {
        _id: author._id,
        username: author.username,
        avatar: author.avatar,
      },
    })
    post = await post.save()
    res.status(200).send(post)
  } catch (ex) {
    res.send(ex)
  }
})

router.post('/like', auth, async (req, res) => {
  const post = await Post.findOne({ _id: req.body.postId })
  const isLiked = post.likes.usersLiked.includes(req.user._id)

  if (!isLiked) {
    await Post.updateOne(
      { _id: req.body.postId },
      {
        $push: {
          'likes.usersLiked': req.user._id,
        },
      }
    )
    res.status(200).send(req.user)
  } else {
    await Post.updateOne(
      { _id: req.body.postId },
      {
        $pull: {
          'likes.usersLiked': req.user._id,
        },
      }
    )
    res.status(200).send(req.user)
  }
})

module.exports = router
