// routes/StandingsRouter.js

const express = require('express')
const router = express.Router()
const controller = require('../controllers/ApiCtrl')

// Define the route for fetching standings
router.get('/standings', controller.getStandings)

// Define the route for fetching upcoming matches
// router.get('/upcoming-matches', controller.getUpcomingMatches)

module.exports = router
