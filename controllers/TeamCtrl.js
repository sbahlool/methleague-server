const { Team } = require('../models')

const addTeam = async (req, res) => {
  try {
    const { teamname, logo } = req.body

    // Check if the teamname already exists
    const existingTeam = await Team.findOne({ teamname })
    if (existingTeam) {
      return res.status(400).json({ message: 'Teamname already exists' })
    }

    // Create a new team
    const newTeam = new Team({
      teamname,
      logo
    })

    // Save the team to the database
    await newTeam.save()

    res.status(201).json({ message: 'Team added successfully', team: newTeam })
  } catch (error) {
    console.error('Error adding team:', error)
    res.status(500).json({ error: 'Failed to add team' })
  }
}

const getTeams = async (req, res) => {
  try {
    const teams = await Team.find()
    res.status(200).json(teams)
  } catch (error) {
    console.error('Error fetching teams:', error)
    res.status(500).json({ error: 'Failed to fetch teams' })
  }
}

module.exports = { addTeam, getTeams }
