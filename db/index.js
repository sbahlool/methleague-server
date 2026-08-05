// Load mongoose module
const mongoose = require('mongoose')
// Load dotenv module
require('dotenv').config()

// mongoose Connectio
mongoose
  // Port configurations
  .connect(process.env.MONGODB_URL_NEW)
  .then(() => {
    // Connection message
    console.log('Connected to MongoDB')
  })
  .catch((e) => {
    // cannot connect message
    console.error('Cannot connect to MongoDB', e.message)
  })

const db = mongoose.connection

module.exports = db
