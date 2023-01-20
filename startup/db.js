const { MongoClient } = require('mongodb')
const mongoose = require('mongoose')
const winston = require('winston')

module.exports = function () {
  const mongoURI =
    'mongodb+srv://saydaleivs:Ss20051018@cluster0.fprelfe.mongodb.net/?retryWrites=true&w=majority'

  mongoose.set('strictQuery', false)
  new MongoClient(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .connect()
    .then(() => {
      winston.debug('MongoDb connected')
    })
}
