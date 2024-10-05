const { Schema } = require('mongoose')

const MiniGameMatchSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true }
})

module.exports = MiniGameMatchSchema
