mongoose = require('mongoose');

var journalSchema = new mongoose.Schema({
    date: {type: Date, default: Date.now},
    entry: String,
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    task: {type: mongoose.Schema.Types.ObjectId, ref: 'tasks'}

});

var journalModel = mongoose.model('journals', journalSchema);


module.exports = journalModel;