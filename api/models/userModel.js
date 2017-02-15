// ./api/models/userModel.js
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const _schema = {
    name: {
        type: String,
        required: true
    },
    user: {
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