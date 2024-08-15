const { User, Team, Prediction } = require('../models')
const middleware = require('../middleware')
const path = require('path')
const fs = require('fs')
const upload = require('../middleware/upload')
const multer = require('multer')

const Register = async (req, res) => {
  try {
    const { username, email, password, firstname, lastname, team } = req.body
    const profilePicture = 'default.png'
    let passwordDigest = await middleware.hashPassword(password)

    let existingEmail = await User.findOne({ email })
    let existingUsername = await User.findOne({ username })

    if (existingEmail) {
      return res
        .status(400)
        .send('A user with that email has already been registered!')
    } else if (existingUsername) {
      return res.status(400).send('Username is already taken!')
    } else {
      const user = await User.create({
        username,
        email,
        passwordDigest,
        firstname,
        lastname,
        profilePicture,
        team // Add team to the user creation
      })
      res.send(user)
    }
  } catch (error) {
    throw error
  }
}

const Login = async (req, res) => {
  try {
    // Extract inputs from body
    const { username, password } = req.body
    // Find User by username OR email
    let user =
      (await User.findOne({ username })) ||
      (await User.findOne({ email: username }))
    // Check password with database
    if (user) {
      let matched = await middleware.comparePassword(
        user.passwordDigest,
        password
      )
      if (matched) {
        let payload = {
          id: user.id,
          username: user.username,
          role: user.role // Include the role in the payload
        }
        let token = middleware.createToken(payload)
        return res.send({ user: payload, token })
      }
    }
    res.status(401).send({ status: 'Error', msg: 'Wrong credentials!' })
  } catch (error) {
    console.log(error)
    res.status(401).send({ status: 'Error', msg: 'An error has occurred!' })
  }
}

const ChangePassword = async (req, res) => {
  try {
    // Extract old and new passwords from body
    const { oldPassword, newPassword } = req.body
    // Find User by username (params)
    let user = await User.findOne({ username: req.params.username })
    // Compate entered existing password with actual password in DB
    let matched = await middleware.comparePassword(
      user.passwordDigest,
      oldPassword
    )
    if (matched) {
      let passwordDigest = await middleware.hashPassword(newPassword)
      user = await User.findOneAndUpdate(
        { username: req.params.username },
        { passwordDigest }
      )
      let payload = {
        id: user.id,
        username: user.username
      }
      return res.send({ status: 'Password Updated!', user: payload })
    }
    res
      .status(401)
      .send({ status: 'Error', msg: 'Old password did not match!' })
  } catch (error) {
    console.log(error)
    res.status(401).send({
      status: 'Error',
      msg: 'An error has occurred while changing password!'
    })
  }
}

const GetProfile = async (req, res) => {
  try {
    let user = await User.findOne({ username: req.params.username }).populate(
      'team'
    )
    return user ? res.send(user) : res.status(400).send('User not found!')
  } catch (error) {
    throw error
  }
}

const EditProfile = async (req, res) => {
  try {
    const { username, email, firstname, lastname, team } = req.body
    let user = await User.findOne({ username: req.params.username })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (req.file && req.file.filename) {
      const profilePicture = req.file.filename

      if (user.profilePicture && user.profilePicture !== 'default.png') {
        const oldPath = path.join(
          __dirname,
          '../../meth_league-client/public/uploads',
          user.profilePicture
        )
        fs.unlink(oldPath, (err) => {
          if (err) console.error('Failed to delete old profile picture:', err)
        })
      }

      user.profilePicture = profilePicture
    }

    user.username = username || user.username
    user.email = email || user.email
    user.firstname = firstname || user.firstname
    user.lastname = lastname || user.lastname
    user.team = team || user.team

    await user.save()

    res.status(200).json(user)
  } catch (error) {
    console.error('Error updating profile:', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
}

const CheckSession = async (req, res) => {
  const { payload } = res.locals
  res.send(payload)
}

const GetTeams = async (req, res) => {
  try {
    const teams = await Team.find()
    res.send(teams)
  } catch (error) {
    res.status(500).send('An error occurred while fetching teams')
  }
}

const GetUsers = async (req, res) => {
  try {
    const users = await User.find({}).populate('team')
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
}

const GetUserById = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id).populate('team')
    if (!user) {
      return res.status(404).send('User not found!')
    }
    res.json(user)
  } catch (error) {
    console.error('Error fetching user by ID:', error)
    res.status(500).send('An error occurred while fetching the user.')
  }
}

const GetUserPrediction = async (req, res) => {
  try {
    const { match, user } = req.query
    const prediction = await Prediction.findOne({ match, user }).populate(
      'match user'
    )
    return prediction ? res.json([prediction]) : res.json([])
  } catch (error) {
    console.error('Error fetching user prediction:', error)
    res.status(500).send('Server error')
  }
}

module.exports = {
  Register,
  Login,
  ChangePassword,
  GetProfile,
  EditProfile,
  CheckSession,
  GetTeams,
  GetUsers,
  GetUserById,
  GetUserPrediction
}
