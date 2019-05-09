var express = require('express');
var router = express.Router();

var statusModel = require('../models/statusModel');
var projectModel = require('../models/projectModel');
var userModel = require('../models/userModel');

var taskController = require('../controllers/taskController');
var journalController = require('../controllers/journalController');

/* GET home page. */
router.get('/', async function(req, res) {
    if (!req.session.user_id){
        res.redirect('/auth');
    }
    else {
        //display list of projects
        var tasks = await taskController.getUserTasks(req,res);
        res.render('list_tasks',{object : tasks});
    }

});



module.exports = router;