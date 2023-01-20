const express = require('express')
const app = express()
const winston = require('winston')
require('./startup/logging')()
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/prod')(app)

app.get('/', (req, res) => {
  res.status(200)
})

const port = process.env.PORT || 8000

const server = app.listen(port, () => {
  winston.info(`Started listerning to port ${port}....`)
})

module.exports = server
