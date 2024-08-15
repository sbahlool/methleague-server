const { Match, Prediction } = require('../models')

const addMatch = async (req, res) => {
  try {
    const { gameweek, date, time, homeTeam, awayTeam } = req.body
    if (!gameweek || !date || !time || !homeTeam || !awayTeam) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    const newMatch = new Match({
      gameweek,
      date,
      time,
      homeTeam,
      awayTeam,
      isCompleted: false // Default to false
    })

    const savedMatch = await newMatch.save()
    res.status(201).json(savedMatch)
  } catch (error) {
    console.error('Error adding match:', error)
    res.status(500).json({ error: 'Failed to add match' })
  }
}

const getMatches = async (req, res) => {
  try {
    const matches = await Match.find().populate('homeTeam awayTeam isCompleted')
    res.status(200).json(matches)
  } catch (error) {
    console.error('Error fetching matches:', error)
    res.status(500).json({ error: 'Failed to fetch matches' })
  }
}

const getMatchById = async (req, res) => {
  try {
    const { id } = req.params
    const match = await Match.findById(id).populate(
      'homeTeam awayTeam isCompleted'
    )
    if (!match) {
      return res.status(404).json({ error: 'Match not found' })
    }
    res.status(200).json(match)
  } catch (error) {
    console.error('Error fetching match by ID:', error)
    res.status(500).json({ error: 'Failed to fetch match' })
  }
}

const calculatePoints = (
  homeScore,
  awayScore,
  predictedHomeScore,
  predictedAwayScore
) => {
  // Ensure scores are numbers
  homeScore = Number(homeScore)
  awayScore = Number(awayScore)
  predictedHomeScore = Number(predictedHomeScore)
  predictedAwayScore = Number(predictedAwayScore)

  console.log('Actual scores:', homeScore, awayScore)
  console.log('Predicted scores:', predictedHomeScore, predictedAwayScore)

  // Check for exact prediction
  if (homeScore === predictedHomeScore && awayScore === predictedAwayScore) {
    return 3 // Exact prediction
  }

  // Check for correct outcome prediction
  const actualOutcome =
    homeScore === awayScore ? 'draw' : homeScore > awayScore ? 'home' : 'away'
  const predictedOutcome =
    predictedHomeScore === predictedAwayScore
      ? 'draw'
      : predictedHomeScore > predictedAwayScore
      ? 'home'
      : 'away'

  if (actualOutcome === predictedOutcome) {
    return 1 // Correct outcome prediction
  }

  return 0 // No points
}

const updateMatchScores = async (req, res) => {
  try {
    const { matchId } = req.params
    const { homeScore, awayScore } = req.body

    const match = await Match.findById(matchId)
    if (!match) {
      return res.status(404).json({ message: 'Match not found' })
    }

    // Update match scores
    match.homeScore = homeScore
    match.awayScore = awayScore
    match.isCompleted = true // Set isCompleted to true (boolean)
    await match.save()

    // Fetch predictions for the match and update points
    const predictions = await Prediction.find({ match: matchId })
    console.log('Predictions before update:', predictions) // Debugging statement

    for (const prediction of predictions) {
      const points = calculatePoints(
        homeScore,
        awayScore,
        prediction.predictedHomeScore,
        prediction.predictedAwayScore
      )

      console.log(
        'Updating prediction:',
        prediction._id,
        'with points:',
        points
      ) // Debugging statement

      await Prediction.findByIdAndUpdate(
        prediction._id,
        { points },
        { new: true } // Ensure the updated document is returned
      )
    }

    // Confirm the predictions are updated
    const updatedPredictions = await Prediction.find({ match: matchId })
    console.log('Predictions after update:', updatedPredictions) // Debugging statement

    res.status(200).json({ message: 'Scores updated successfully', match })
  } catch (error) {
    console.error('Failed to update scores:', error)
    res.status(500).json({ message: 'Failed to update scores', error })
  }
}

module.exports = { addMatch, getMatches, getMatchById, updateMatchScores }
