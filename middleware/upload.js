const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../meth_league-client/public/uploads'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`)
  }
})

const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb('Error: Images Only!')
  }
}

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb)
  }
})

module.exports = upload
