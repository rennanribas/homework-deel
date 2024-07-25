const express = require('express')
const bodyParser = require('body-parser')
const router = require('./routes')
const entities = require('./entities')

const app = express()

app.set('entities', entities)
app.use(bodyParser.json())
app.use(router)

module.exports = app
