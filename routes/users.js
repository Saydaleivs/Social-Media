const express = require("express")
const router = express.Router()
const { User } = require("../models/user")

router.get("/", async (req, res) => {
  const limitedUsers = await User.find().limit(+req.query.limit)

  res.send(limitedUsers)
})

module.exports = router
