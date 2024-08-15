const router = require('express').Router()
const controller = require('../controllers/MatchCtrl')

router.post('/matches', controller.addMatch)
router.get('/matches', controller.getMatches)
router.get('/match/:id', controller.getMatchById)
router.put('/update-scores/:matchId', controller.updateMatchScores)

module.exports = router
