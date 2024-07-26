const express = require('express')
const bodyParser = require('body-parser')
const router = require('./routes')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(router)

module.exports = app
