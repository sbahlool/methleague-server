const { User, MiniGameMatch } = require('../models')

// For this game, the "score" is turns taken — fewer is better. A fresh
// user has MatchHighScore at its schema default of 0, which can't be a
// real turn count (you need at least a few pairs' worth of turns to win),
// so 0 doubles as "no record yet" rather than needing a separate flag.
const recordScore = async (userId, newScore) => {
  await MiniGameMatch.create({ user: userId, score: newScore })

  const user = await User.findById(userId)
  if (!user) {
    throw new Error('User not found')
  }

  const isFirstRecord = user.MatchHighScore === 0
  const isNewBest = newScore < user.MatchHighScore

  if (isFirstRecord || isNewBest) {
    user.MatchHighScore = newScore
    await user.save()
  }

  return { bestScore: user.MatchHighScore, isNewBest: isFirstRecord || isNewBest }
}

const getHighScore = async (userId) => {
  const user = await User.findById(userId)
  if (!user) {
    throw new Error('User not found')
  }
  return user.MatchHighScore
}

module.exports = {
  recordScore,
  getHighScore,
}