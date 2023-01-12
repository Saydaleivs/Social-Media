require('dotenv').config()

module.exports = function () {
  if (!process.env.JWT_KEY) {
    throw new Error(
      'Error: JWT private key is not specified in environment variable'
    )
  }
}
