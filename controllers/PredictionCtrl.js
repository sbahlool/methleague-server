const { Prediction, Match, User } = require('../models')

const addPrediction = async (req, res) => {
  try {
    const { match, user, predictedHomeScore, predictedAwayScore } = req.body

    // Check if prediction already exists for this match and user
    let existingPrediction = await Prediction.findOne({ match, user })

    if (existingPrediction) {
      // Update existing prediction
      existingPrediction.predictedHomeScore = predictedHomeScore
      existingPrediction.predictedAwayScore = predictedAwayScore
      const updatedPrediction = await existingPrediction.save()
      res.status(200).json(updatedPrediction)
    } else {
      // Create new prediction
      const newPrediction = new Prediction({
        match,
        user,
        predictedHomeScore,
        predictedAwayScore
      })
      const savedPrediction = await newPrediction.save()
      res.status(201).json(savedPrediction)
    }
  } catch (error) {
    console.error('Error adding or updating prediction:', error)
    res.status(500).json({ error: 'Failed to add or update prediction' })
  }
}

const updatePrediction = async (req, res) => {
  try {
    const prediction = await Prediction.findByIdAndUpdate(
      req.params.prediction_id,
      req.body,
      { new: true }
    )
    if (!prediction) {
      return res.status(404).send({ message: 'Prediction not found' })
    }
    res.send(prediction)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

const getPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find().populate('match user')
    res.status(200).json(predictions)
  } catch (error) {
    console.error('Error fetching predictions:', error)
    res.status(500).json({ error: 'Failed to fetch predictions' })
  }
}

const getMatchById = async (req, res) => {
  try {
    const { id } = req.params
    const match = await Match.findById(id).populate('homeTeam awayTeam')
    if (!match) {
      return res.status(404).json({ error: 'Match not found' })
    }
    res.status(200).json(match)
  } catch (error) {
    console.error('Error fetching match by ID:', error)
    res.status(500).json({ error: 'Failed to fetch match' })
  }
}

const GetUserPredictions = async (req, res) => {
  const { userId } = req.params
  try {
    const predictions = await Prediction.find({ user: userId })
      .populate({
        path: 'match',
        populate: [
          { path: 'homeTeam', model: 'Team' },
          { path: 'awayTeam', model: 'Team' }
        ]
      })
      .exec()

    res.send(predictions)
  } catch (error) {
    console.error('Error fetching user predictions:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

const getUserPredictions = async (req, res) => {
  const { userId } = req.params
  try {
    const predictions = await Prediction.find({ user: userId })
      .populate({
        path: 'match',
        populate: [
          { path: 'homeTeam', model: 'Team' },
          { path: 'awayTeam', model: 'Team' }
        ]
      })
      .exec()

    if (!predictions) {
      return res.status(404).json({ error: 'Predictions not found' })
    }

    res.status(200).json(predictions)
  } catch (error) {
    console.error('Error fetching user predictions:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

const getPrediction = async (req, res) => {
  try {
    const prediction = await Prediction.findOne({
      user: req.params.userId,
      match: req.params.matchId
    })
      .populate('match')
      .populate('user')
    res.send(prediction)
  } catch (error) {
    res.status(500).send({ error: 'Failed to get prediction' })
  }
}

const getPredictionByUserAndMatch = async (req, res) => {
  try {
    const prediction = await Prediction.findOne({
      user: req.params.userId,
      match: req.params.matchId
    })
      .populate('user')
      .populate({
        path: 'match',
        populate: [
          { path: 'homeTeam', model: 'Team' },
          { path: 'awayTeam', model: 'Team' }
        ]
      })
      .exec()

    if (!prediction) {
      return res.status(404).send({ message: 'Prediction not found' })
    }
    res.send(prediction)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

const getAllPredictionsByGameweek = async (req, res) => {
  try {
    console.log('getAllPredictionsByGameweek called') // Log to ensure method is called
    const { gameweek } = req.params
    console.log(`Gameweek: ${gameweek}`) // Log the gameweek parameter

    const matches = await Match.find({ gameweek })
    console.log(`Matches: ${matches}`) // Log the matches found
    const matchIds = matches.map((match) => match._id)

    const predictions = await Prediction.find({ match: { $in: matchIds } })
      .populate({
        path: 'match',
        populate: [
          { path: 'homeTeam', model: 'Team' },
          { path: 'awayTeam', model: 'Team' }
        ]
      })
      .populate('user')
      .exec()

    console.log(`Predictions: ${predictions}`) // Log the predictions found
    res.status(200).json(predictions)
  } catch (error) {
    console.error('Error fetching predictions by gameweek:', error)
    res.status(500).json({ error: 'Failed to fetch predictions' })
  }
}

module.exports = {
  addPrediction,
  getPredictions,
  getMatchById,
  GetUserPredictions,
  updatePrediction,
  getUserPredictions,
  getPrediction,
  getPredictionByUserAndMatch,
  getAllPredictionsByGameweek
}
