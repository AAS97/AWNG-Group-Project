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

router.get('/:taskId/modify', async function(req,res){
    if (!req.session.user_id){
        res.redirect('/auth');
    }
    else {
        //display modify form
        var [task, history] = await taskController.getTask(req,res);
        var project = await projectModel.findById(task.project)
            .populate({path : 'members', model: userModel, select : 'firstname name'});
        var status = await statusModel.find().exec();
        res.render('modify_task',{task : task, project : project, status :status});

    }});

router.post('/:taskId/modify', async function(req,res){
    if (!req.session.user_id){
        res.redirect('/auth');
    }
    else {
        await taskController.editTask(req,res);
        var [task, history] = await taskController.getTask(req,res);
        res.render('task',{task : task, history : history});
    }});

router.get('/:taskId',async function(req, res) {
    if (!req.session.user_id){
        res.redirect('/auth');
    }
    else {
        //display list of projects
        var [task, history] = await taskController.getTask(req,res);
        res.render('task',{task : task, history : history});

    }});

router.post('/:taskId',async function(req, res) {
    if (!req.session.user_id){
        res.redirect('/auth');
    }
    else {
        //display list of projects
        await journalController.newJournal(req, res);
        var [task, history] = await taskController.getTask(req,res);
        res.render('task',{task : task, history : history});

    }});

module.exports = router;