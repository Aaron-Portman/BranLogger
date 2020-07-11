'use strict';

const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

//var userSchema = mongoose.Schema( {any:{}})

var userSchema = Schema( {
  userId: ObjectId,
  googleid: String,
  googletoken: String,
  googlename:String,
  googleemail:String,
  username:String,
  role:Number,   // 0 = Athlete, 1 = Coach
} );

module.exports = mongoose.model( 'User', userSchema );
