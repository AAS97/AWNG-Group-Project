mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
    name : String,
    members : [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}]

});

var projectModel = mongoose.model('projects', projectSchema);


module.exports = projectModel;