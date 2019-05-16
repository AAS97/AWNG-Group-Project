var journalModel = require('../models/journalModel');
var userModel = require('../models/userModel');

var moment = require('moment');

exports.getTaskJournals = async function (req, res) {
    var journals = await journalModel.find({task: req.params.taskId})
        .sort({date: -1})
        .populate({path: 'author', model: userModel, select: 'firstname name'})
        .catch(function (err) {
            console.log(err);
            res.render('error', {message: 'erreur getting journals', error: err});
        });

    for (var j = 0; j < journals.length; j++) {
        journals[j].formatted_date = await moment(journals[j].date).format('YYYY-MM-DD');

    }

    return (journals);
};

exports.newJournal = async function (req, res) {
    var newJournal = new journalModel({
        entry: req.body.entry,
        task: req.params.taskId,
        author: req.session.user_id
    });

    newJournal.save();

};

