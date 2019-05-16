/*
    File to define mongoose model for user
*/


var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: String,
    firstname: String,
    login: String,
    password: String,
    role: [{type: String, enum: ['member', 'admin']}]

});

var userModel = mongoose.model('users', userSchema);

module.exports = userModel;
