'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const workoutSchema = Schema( {
    //id: ObjectId,
    userId: ObjectId,
    year: Number,
    month: Number,
    day: Number,
    dayOfWeek: Number,  
    workout: String,
    grade: String,
    notes: String,
    gradeColor: String,
});

module.exports = mongoose.model('Workout', workoutSchema)