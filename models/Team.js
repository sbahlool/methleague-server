const { Schema } = require('mongoose')

const teamSchema = new Schema({
  teamname: { type: String, required: true, unique: true },
  logo: { type: String }
})

module.exports = teamSchema
