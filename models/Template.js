const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const templateSchema = Schema({
    name: String,
    weekId: ObjectId,
    dayOrder: [Number],
});


module.exports = mongoose.model('Template', templateSchema)