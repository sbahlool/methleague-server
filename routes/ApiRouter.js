const express = require('express')
const router = express.Router()
const controller = require('../controllers/ApiCtrl')

router.get('/standings', controller.getStandings)

module.exports = router
