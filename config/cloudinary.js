const cloudinary = require('cloudinary').v2

// Set these with:
//   heroku config:set CLOUDINARY_CLOUD_NAME=xxx CLOUDINARY_API_KEY=xxx CLOUDINARY_API_SECRET=xxx
// Get the values from your Cloudinary dashboard (cloudinary.com) after signing up —
// they're shown right on the dashboard homepage under "Account Details".
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

module.exports = cloudinary