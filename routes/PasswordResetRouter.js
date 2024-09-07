const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const { User } = require('../models')

// Request password reset
router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body
    console.log('Received email:', email) // Log the received email

    const user = await User.findOne({ email })
    if (!user) {
      console.log('User not found for email:', email)
      return res.status(404).json({ message: 'User not found' })
    }

    const token = crypto.randomBytes(20).toString('hex')
    user.resetPasswordToken = token
    user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
    await user.save()

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/password-reset/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    }

    await transporter.sendMail(mailOptions)
    res.status(200).json({ message: 'Reset email sent' })
  } catch (error) {
    console.error('Error in forgot password process:', error)
    res.status(500).json({
      message: 'Error in forgot password process',
      error: error.message
    })
  }
})

// Reset password
router.post('/reset', async (req, res) => {
  try {
    const { token, newPassword } = req.body
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Password reset token is invalid or has expired' })
    }

    user.password = newPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    res.status(200).json({ message: 'Password has been reset' })
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error })
  }
})

// Add this new route
router.get('/reset/:token', async (req, res) => {
  try {
    const { token } = req.params
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res
        .status(400)
        .send('Password reset token is invalid or has expired.')
    }

    // Render the password reset page
    res.render('reset', { token }) // You'll need to create this view
  } catch (error) {
    console.error('Error in reset password page:', error)
    res.status(500).send('Error in reset password page')
  }
})

module.exports = router
