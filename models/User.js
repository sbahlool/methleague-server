const { Schema } = require('mongoose')
const teamSchema = require('./Team')

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordDigest: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    profilePicture: { type: String },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  { timestamps: true }
)

module.exports = userSchema
