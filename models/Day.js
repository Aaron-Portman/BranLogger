const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const daySchema = Schema( {
    mileage: String,
    workoutOrExtras: String,
    exercises: String,
});

module.exports = mongoose.model('Day', daySchema)