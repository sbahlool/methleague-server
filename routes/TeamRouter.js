const router = require('express').Router()
const controller = require('../controllers/TeamCtrl')

router.post('/add', controller.addTeam)

// Endpoint for fetching teams
router.get('/', controller.getTeams)

module.exports = router
