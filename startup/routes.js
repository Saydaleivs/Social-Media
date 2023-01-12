const express = require('express')
const cors = require('cors')
const errorMiddleware = require('../middleware/error')
const postsRoute = require('../routes/posts')
const userRoute = require('../routes/user')
const usersRoute = require('../routes/users')
const editRoute = require('../routes/edit')

module.exports = function (app) {
  // Middleware
  app.use(express.json({ limit: '50mb' }))
  app.use(cors())

  // Routes
  app.use('/api/user', userRoute)
  app.use('/api/users', usersRoute)
  app.use('/api/posts', postsRoute)
  app.use('/api/edit', editRoute)
  app.use(errorMiddleware)
}
