const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail')
const middleware = require('../middleware')
const { User } = require('../models')

// Where the frontend actually lives — the reset link in the email needs to
// point here, not at req.headers.host (which is this backend's own host).
const CLIENT_URL = process.env.CLIENT_URL || 'http://methleague.surge.sh'

// Request password reset
router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (user) {
      const token = crypto.randomBytes(20).toString('hex')
      user.resetPasswordToken = token
      user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
      await user.save()

      const resetLink = `${CLIENT_URL}/reset/${token}`

      // Still awaited so a real send failure surfaces in logs, but the
      // response message below never reveals whether the account existed.
      await sendEmail({
        to: user.email,
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          ${resetLink}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      })
    }

    // Same response whether or not the account exists — never let this
    // endpoint be used to check which emails are registered.
    res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' })
  } catch (error) {
    console.error('Error in forgot password process:', error)
    res.status(500).json({
      message: 'Error in forgot password process',
      error: error.message,
    })
  }
})

// Reset password
router.post('/reset', async (req, res) => {
  try {
    const { token, newPassword } = req.body
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' })
    }

    // The schema field is `passwordDigest` (hashed) — there is no plain
    // `password` field, so writing to it was silently dropped and the
    // password was never actually being changed.
    user.passwordDigest = await middleware.hashPassword(newPassword)
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    res.status(200).json({ message: 'Password has been reset' })
  } catch (error) {
    console.error('Error resetting password:', error)
    res.status(500).json({ message: 'Error resetting password', error: error.message })
  }
})

module.exports = router