const { Schema } = require('mongoose')

const PredictionSchema = new Schema({
  match: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  predictedHomeScore: { type: Number, required: true },
  predictedAwayScore: { type: Number, required: true },
  points: { type: Number, default: 0 }
})

module.exports = PredictionSchema
