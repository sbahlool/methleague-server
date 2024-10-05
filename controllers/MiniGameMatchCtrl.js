const { User, MiniGameMatch } = require('../models')

const recordScore = async (userId, newScore) => {
  await MiniGameMatch.create({ user: userId, score: newScore })

  const user = await User.findById(userId)
  if (newScore > user.highScore) {
    user.highScore = newScore
    await user.save()
  }
}

module.exports = {
  recordScore
}
