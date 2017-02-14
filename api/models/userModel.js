'use strict'

const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/jwt')

const Schema = mongoose.Schema

const _schema = {
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}

const userSchema = new Schema(_schema)
const userModel = mongoose.model('user', userSchema)

module.exports = userModel