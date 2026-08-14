// Load mongoose module
const mongoose = require('mongoose')
// Load dotenv module
require('dotenv').config()

// Prefer explicit connection env vars; fall back to other common names
const mongoUri =
  process.env.MONGODB_URL_NEW || process.env.MONGODB_URI || process.env.MONGODB_URIL

if (!mongoUri) {
  console.error(
    'Missing MongoDB connection string. Set MONGODB_URL_NEW or MONGODB_URI in environment.'
  )
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((e) => {
    console.error('Cannot connect to MongoDB', e.message)
  })

const db = mongoose.connection

module.exports = db
