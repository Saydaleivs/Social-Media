const mongoose = require('mongoose')
const winston = require('winston')

module.exports = function () {
  const mongoURI = 'mongodb://127.0.0.1/web-media'

  mongoose.set('strictQuery', false)
  mongoose
    .connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      winston.debug('MongoDb connected')
    })
}
