const express = require('express')
const cors = require('cors')
require('dotenv').config()
const path = require('path')

const db = require('./db')
const PORT = process.env.PORT || 4000

const app = express()

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        'http://methleague.surge.sh',
        'http://localhost:5173'
      ]
      if (
        !origin ||
        allowedOrigins.indexOf(origin) !== -1 ||
        process.env.NODE_ENV === 'development'
      ) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const AuthRouter = require('./routes/AuthRouter')
const TeamRouter = require('./routes/TeamRouter')
const MatchRouter = require('./routes/MatchRouter')
const PredictionRouter = require('./routes/PredictionRouter')
const ApiRouter = require('./routes/ApiRouter')
const PasswordResetRouter = require('./routes/PasswordResetRouter')

app.use('/auth', AuthRouter) // Auth routes
app.use('/teams', TeamRouter) // Team routes
app.use('/match', MatchRouter) // Match routes
app.use('/predictions', PredictionRouter) // Prediction routes
app.use('/api', ApiRouter)
app.use('/password-reset', PasswordResetRouter)

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
