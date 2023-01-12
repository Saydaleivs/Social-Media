require('express-async-errors')
require('winston-mongodb')
const winston = require('winston')

module.exports = function () {
  winston.add(
    new winston.transports.File({
      filename: 'logs/webmedia-logs.log',
      level: 'error',
    })
  )
  winston.add(
    new winston.transports.MongoDB({ db: 'mongodb://127.0.0.1/web-media-logs' })
  )
  winston.exceptions.handle(
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/webmedia-logs.log' })
  )

  process.on('uncaughtException', (ex) => {
    throw ex
  })
}
