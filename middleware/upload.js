const multer = require('multer')
const path = require('path')
const fs = require('fs')

// This mirrors the path already referenced in the commented-out block in
// AuthCtrl.js's EditProfile — adjust if your folder structure differs.
// __dirname here is .../server/src/middleware (or wherever this file lives),
// so this resolves to .../meth_league-client/public/uploads.
const UPLOAD_DIR = path.join(__dirname, '../../meth_league-client/public/uploads')

// Make sure the folder exists so multer doesn't fail on a fresh clone/deploy.
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR)
  },
  filename: (req, file, cb) => {
    // e.g. sbahlool-1723999999999.png — unique per upload, keeps the
    // original extension, and is easy to trace back to the user in logs.
    const ext = path.extname(file.originalname).toLowerCase()
    const safeUsername = (req.params.username || 'user').replace(/[^a-z0-9_-]/gi, '')
    cb(null, `${safeUsername}-${Date.now()}${ext}`)
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