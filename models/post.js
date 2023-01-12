const Joi = require("joi")
const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
  image: String,
  likes: {
    count: { type: Number, required: true },
    usersLiked: Array,
  },
  date: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    _id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
  },
})

const Post = mongoose.model("Posts", postSchema)

function validatePost(post) {
  const schema = Joi.object({
    image: Joi.string().allow(""),
    description: Joi.string().required(),
    date: Joi.string().required(),
    authorId: mongoose.Types.ObjectId,
  })

  return schema.validate(post)
}

exports.Post = Post
exports.validate = validatePost
