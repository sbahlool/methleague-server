const router = require('express').Router()
const controller = require('../controllers/AuthCtrl')
const middleware = require('../middleware')
// const upload = require('../middleware/upload')

router.post('/login', controller.Login)
router.post('/register', controller.Register)
router.get('/profile/:username', controller.GetProfile)
router.put(
  '/editProfile/:username',
  middleware.stripToken,
  middleware.verifyToken,
  controller.EditProfile
)
router.put(
  '/changePassword/:username',
  middleware.stripToken,
  middleware.verifyToken,
  controller.ChangePassword
)
router.get(
  '/session',
  middleware.stripToken,
  middleware.verifyToken,
  controller.CheckSession
)

router.get('/teams', controller.GetTeams)
router.get('/users', controller.GetUsers)
router.get(
  '/admin/users',
  middleware.stripToken,
  middleware.verifyToken,
  middleware.verifyAdmin,
  async (req, res) => {
    try {
      const users = await User.find({})
      res.send(users)
    } catch (error) {
      res.status(500).send('Server error')
    }
  }
)
router.get('/users/:id', controller.GetUserById)
router.get('/predictions', controller.GetUserPrediction)

module.exports = router
