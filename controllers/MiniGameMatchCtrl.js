const { User, MiniGameMatch } = require('../models')

const recordScore = async (userId, newScore) => {
  await MiniGameMatch.create({ user: userId, score: newScore })

  const user = await User.findById(userId)
  if (newScore > user.highScore) {
    user.highScore = newScore
    await user.save()
  }
}

const getHighScore = async (userId) => {
  const user = await User.findById(userId)
  if (!user) {
    throw new Error('User not found')
  }
  return user.highScore
}

module.exports = {
  recordScore,
  getHighScore // Export the new function
}
