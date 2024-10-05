const router = require('express').Router()
const controller = require('../controllers/MiniGameMatchCtrl')
const User = require('../models/User')

// Route to record a game score
router.post('/score', controller.recordScore)

router.get('/highscore/:userId', async (req, res) => {
  const { userId } = req.params

  try {
    const highScore = await controller.getHighScore(userId) // Call the controller function
    res.send({ highScore }) // Send the high score in the response
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: error.message }) // Send the error message
  }
})

module.exports = router
