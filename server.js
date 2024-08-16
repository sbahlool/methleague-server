const express = require('express')
const cors = require('cors')
require('dotenv').config()
const path = require('path')

const db = require('./db')
const PORT = process.env.PORT || 4000

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(express.static(path.join(__dirname, '../meth_league-client/dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../meth_league-client/dist', 'index.html'))
})

const AuthRouter = require('./routes/AuthRouter')
const TeamRouter = require('./routes/TeamRouter')
const MatchRouter = require('./routes/MatchRouter')
const PredictionRouter = require('./routes/PredictionRouter')
const ApiRouter = require('./routes/ApiRouter')

app.use('/auth', AuthRouter) // Auth routes
app.use('/teams', TeamRouter) // Team routes
app.use('/match', MatchRouter) // Match routes
app.use('/predictions', PredictionRouter) // Prediction routes
app.use('/api', ApiRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
