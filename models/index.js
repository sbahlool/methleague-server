const mongoose = require('mongoose')
const userSchema = require('./User')
const teamSchema = require('./Team')
const matchSchema = require('./Match')
const PredictionSchema = require('./Prediction')

const User = mongoose.model('User', userSchema)
const Team = mongoose.model('Team', teamSchema)
const Match = mongoose.model('Match', matchSchema)
const Prediction = mongoose.model('Prediction', PredictionSchema)

module.exports = {
  User,
  Team,
  Match,
  Prediction
}
