const router = require('express').Router()
const controller = require('../controllers/MiniGameMatchCtrl')
const User = require('../models/User')

// Route to record a game score
router.post('/score', async (req, res) => {
  const { userId, score } = req.body

  try {
    await controller.recordScore(userId, score)
    res.status(201).send({ message: 'Score recorded successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'Failed to record score' })
  }
})

router.get('/highscore/:userId', async (req, res) => {
  const { userId } = req.params

  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).send({ error: 'User not found' })
    }
    res.send({ highScore: user.highScore })
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'Failed to retrieve high score' })
  }
})

module.exports = router
