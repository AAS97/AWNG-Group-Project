mongoose = require('mongoose');

var statusSchema = new mongoose.Schema({
    name : String,
    description : {type : String, enum: ['new', 'pending', 'waiting', 'finished', 'closed']}

});

var statusModel = mongoose.model('statuses', statusSchema);


module.exports = statusModel;