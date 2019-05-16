/*
    File to define mongoose model for status
*/


mongoose = require('mongoose');

var statusSchema = new mongoose.Schema({
    name: String
});

var statusModel = mongoose.model('statuses', statusSchema);


module.exports = statusModel;