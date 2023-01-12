const express = require('express')
const app = express()
const winston = require('winston')
require('./startup/logging')()
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/prod')(app)

const port = process.env.PORT || 8000

app.listen(port, () => {
  winston.info(`Started listerning to port ${port}....`)
})
