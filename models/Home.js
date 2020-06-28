'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const homeSchema = Schema( {
    welcome: String,
})

module.exports = mongoose.model('Home', homeSchema)