/*
    File to define mongoose model for task
*/


var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
    name: String,
    description: String,
    start_date: {type: Date, default: Date.now()},
    due_date: Date,
    project: {type: mongoose.Schema.Types.ObjectId, ref: 'Projects'},
    assignee: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
    status: {type: mongoose.Schema.Types.ObjectId, ref: 'Statuses'},
    progress: {type: Number, default: 0},


});

var taskModel = mongoose.model('tasks', taskSchema);

module.exports = taskModel;
