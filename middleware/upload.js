const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const safeUsername = (req.params.username || 'user').replace(/[^a-z0-9_-]/gi, '')
    return {
      folder: 'meth-league/profile-pictures',
      public_id: `${safeUsername}-${Date.now()}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      // Square-crop centered on the face where detectable, so avatars
      // come back consistent regardless of what the user uploaded.
      transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
    }
  },
})

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only JPEG, PNG, WEBP, or GIF images are allowed'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
})

module.exports = upload