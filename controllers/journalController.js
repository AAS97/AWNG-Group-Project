var journalModel = require('../models/journalModel');
var userModel = require('../models/userModel');


exports.getTaskJournals = async function(req, res) {
    var journals = await journalModel.find({task: req.params.taskId})
        .populate({path: 'author', model: userModel, select: 'firstname name'})
        .catch(function (err) {
                console.log(err);
                res.render('error', {message: 'erreur getting journals', error: err});
            });

    return(journals);
};

exports.newJournal = async function (req, res){
  var newJournal = new journalModel({
      entry : req.body.entry,
      task : req.params.taskId,
      author : req.session.user_id
    });

  newJournal.save();

};

