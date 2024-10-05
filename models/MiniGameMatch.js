const { Schema } = require('mongoose')

const MiniGameMatchSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true }, // Store the score for each game
  gameDate: { type: Date, default: Date.now } // Store the date of the game
})

module.exports = MiniGameMatchSchema
