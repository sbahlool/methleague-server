// controllers/ApiCtrl.js

const axios = require('axios')

const FOOTBALL_API_BASE_URL = 'https://api.football-data.org/v4'
const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY // Ensure this key is set in your .env file

// Fetch Premier League Standings
const getStandings = async (req, res) => {
  try {
    const response = await axios.get(
      `${FOOTBALL_API_BASE_URL}/competitions/PL/standings`,
      {
        headers: { 'X-Auth-Token': FOOTBALL_API_KEY }
      }
    )
    res.json(response.data)
  } catch (error) {
    console.error('Error fetching standings:', error)
    res.status(500).json({ error: 'Error fetching standings' })
  }
}

// Fetch Upcoming Matches for Specific Teams
// const getUpcomingMatches = async (req, res) => {
//   const teams = [
//     'Arsenal',
//     'Manchester City',
//     'Manchester United',
//     'Chelsea',
//     'Tottenham Hotspur',
//     'Liverpool'
//   ]
//   try {
//     const matches = await Promise.all(
//       teams.map(async (team) => {
//         const response = await axios.get(
//           `${FOOTBALL_API_BASE_URL}/teams/${team}/matches?status=SCHEDULED`,
//           {
//             headers: { 'X-Auth-Token': FOOTBALL_API_KEY }
//           }
//         )
//         return { team, matches: response.data.matches }
//       })
//     )
//     res.json(matches)
//   } catch (error) {
//     console.error('Error fetching upcoming matches:', error)
//     res.status(500).json({ error: 'Error fetching upcoming matches' })
//   }
// }

module.exports = {
  getStandings
}
