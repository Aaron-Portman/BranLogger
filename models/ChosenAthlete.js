'use strict'

//not sure if  i need this

const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const chosenAthleteSchema = Schema( {
    isChosen: Object,
})

module.exports = mongoose.model('ChosenAthlete', chosenAthleteSchema)

