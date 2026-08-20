const router = require('express').Router()
const controller = require('../controllers/MiniGameMatchCtrl')

// Route to record a game score
router.post('/score', async (req, res) => {
  const { userId, score } = req.body

  if (!userId || typeof score !== 'number') {
    return res.status(400).send({ error: 'userId and a numeric score are required' })
  }

  try {
    const result = await controller.recordScore(userId, score)
    res.status(201).send(result)
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: error.message })
  }
})

router.get('/highscore/:userId', async (req, res) => {
  const { userId } = req.params

  try {
    const highScore = await controller.getHighScore(userId)
    res.send({ highScore })
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: error.message })
  }
})

module.exports = router