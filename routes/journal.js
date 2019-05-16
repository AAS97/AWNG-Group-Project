/*
    Manage /journal route
 */


var express = require('express');
var router = express.Router();

var journalController = require('../controllers/journalController');

//Delete journal
router.get('/:taskId/:journalId/delete', async function (req, res) {
    if (!req.session.user_id) {
        res.redirect('/auth');
    } else {
        await journalController.deleteJournal(req, res);
        res.redirect('/task/'+req.params.taskId);
    }
});


module.exports = router;