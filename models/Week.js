const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const weekSchema = Schema({
    dayIds: [ObjectId],
});


module.exports = mongoose.model('Week', weekSchema)