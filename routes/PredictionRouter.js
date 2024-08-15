// routes/PredictionRouter.js

const router = require('express').Router()
const controller = require('../controllers/PredictionCtrl')
const middleware = require('../middleware')
const checkTimeRestriction = require('../middleware/checkTimeRestriction')

router.post(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  checkTimeRestriction,
  controller.addPrediction
)
router.get('/', controller.getPredictions)
router.get('/match/:id', controller.getMatchById)
router.get(
  '/user/:userId',
  middleware.stripToken,
  middleware.verifyToken,
  controller.GetUserPredictions
)
router.get(
  '/user/:userId/match/:matchId',
  middleware.stripToken,
  middleware.verifyToken,
  controller.getPredictionByUserAndMatch
)
router.put(
  '/:prediction_id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.updatePrediction
)

// Ensure this route includes :gameweek parameter
router.get(
  '/admin/predictions/gameweek/:gameweek',
  controller.getAllPredictionsByGameweek
)

module.exports = router
