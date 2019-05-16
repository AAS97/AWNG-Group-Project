/*
    This file contains all the functions regarding journals management.
 */


var journalModel = require('../models/journalModel');
var userModel = require('../models/userModel');

var moment = require('moment');


//Function returning the journal history of a given task
exports.getTaskJournals = async function (req, res) {
    var journals = await journalModel.find({task: req.params.taskId})
        .sort({date: -1})
        .populate({path: 'author', model: userModel, select: 'firstname name'})
        .catch(function (err) {
            console.log(err);
            res.render('error', {message: 'erreur getting journals', error: err});
        });

    //Format date for better display
    for (var j = 0; j < journals.length; j++) {
        journals[j].formatted_date = await moment(journals[j].date).format('YYYY-MM-DD');

    }

    return (journals);
};

//Function to add a new journal entry to a task
exports.newJournal = async function (req, res) {

    //Creat a new object an save it on the db
    var newJournal = new journalModel({
        entry: req.body.entry,
        task: req.params.taskId,
        author: req.session.user_id
    });

    newJournal.save();

};

//Function to delete a journal
exports.deleteJournal = async function (req, res) {

    await journalModel.findByIdAndDelete(req.params.journalId)
        .catch(function (err) {
            res.render('error', {message: 'error on journal deletion', error: err});
        });

};

