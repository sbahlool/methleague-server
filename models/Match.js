const { Schema } = require('mongoose')

const matchSchema = new Schema({
  gameweek: { type: Number, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  homeTeam: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  awayTeam: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  homeScore: { type: Number, default: 0 },
  awayScore: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false }
})

module.exports = matchSchema
