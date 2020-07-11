'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const easyRunSchema = Schema( {
    userId: ObjectId,
    year: Number,
    month: Number,
    day: Number,
    dayOfWeek: Number,  
    mileage: Number,
    avgTime: String,
    minutes: Number,
    seconds: String,
    grade: String,
    notes: String,
    gradeColor: String,
});

module.exports = mongoose.model('EasyRun', easyRunSchema)