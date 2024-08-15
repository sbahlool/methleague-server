// middleware/checkTimeRestriction.js
const { Match } = require('../models')

const checkTimeRestriction = async (req, res, next) => {
  try {
    const match = await Match.findById(req.body.match || req.params.matchId)
    if (!match) {
      return res.status(404).json({ error: 'Match not found' })
    }

    const matchTime = new Date(match.date + ' ' + match.time)
    const currentTime = new Date()
    const timeDiff = (matchTime - currentTime) / (1000 * 60) // time difference in minutes

    if (timeDiff <= 30) {
      return res.status(403).json({
        error: 'Cannot update prediction within 30 minutes of the match time'
      })
    }

    next()
  } catch (error) {
    console.error('Error checking time restriction:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = checkTimeRestriction
