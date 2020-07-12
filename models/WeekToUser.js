'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const weekToUserSchema = Schema( {
    userId: ObjectId,
    weekId: ObjectId,
    dayOrder: [Number],
    year: Number,
    month: Number,
    day: Number,
});

module.exports = mongoose.model('WeekToUser', weekToUserSchema)