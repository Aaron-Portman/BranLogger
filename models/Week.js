'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const daySchema = Schema( {
    mileage: Number,
    exercises: String,
    workoutOrExtras: String,
    year: Number,
    month: Number,
    day: Number,
    dayOfWeek: Number,  
});

const weekSchema = Schema( {
    userId: ObjectId,
    days: [daySchema],
    startYear: Number,
    startMonth: Number,
    startDay: Number,
});
const chosenAthleteSchema = Schema( {
    chosen: Object,
})

module.exports = mongoose.model('Week', weekSchema)