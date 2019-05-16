/*
    Manage /task route i.e task management
 */

var express = require('express');
var router = express.Router();

var statusModel = require('../models/statusModel');
var projectModel = require('../models/projectModel');
var userModel = require('../models/userModel');

var taskController = require('../controllers/taskController');
var journalController = require('../controllers/journalController');

//Display list of tasks
router.get('/', async function (req, res) {
    if (!req.session.user_id) {
        res.redirect('/auth');
    } else {
        //display list of projects
        var tasks = await taskController.getUserTasks(req, res);
        res.render('list_tasks', {object: tasks});
    }

});

//Render task modify form
router.get('/:taskId/modify', async function (req, res) {
    if (!req.session.user_id) {
        res.redirect('/auth');
    } else {
        //display modify form
        var [task, history] = await taskController.getTask(req, res);
        var project = await projectModel.findById(task.project)
            .populate({
                path: 'members',
                match: {_id: {$ne: task.assignee._id}},
                model: userModel,
                select: 'firstname name'
            });
        var status = await statusModel.find({name: {$ne: task.status.name}}).exec();
        res.render('modify_task', {task: task, project: project, status: status});

    }
});

//Delete task
router.get('/:taskId/delete', async function (req, res) {
    if (!req.session.user_id) {
        res.redirect('/auth');
    } else {
        await taskController.deleteTask(req, res);
        res.redirect('/task');
    }
});

//Get form entry for task modification
router.post('/:taskId/modify', async function (req, res) {
    if (!req.session.user_id) {
        res.redirect('/auth');
    } else {
        await taskController.editTask(req, res);
        res.redirect('/task/' + req.params.taskId);
    }
});

//Display task details
router.get('/:taskId', async function (req, res) {
    if (!req.session.user_id) {
        res.redirect('/auth');
    } else {
        //display list of projects
        var [task, history] = await taskController.getTask(req, res);
        res.render('task', {task: task, history: history});

    }
});

//Creat new journal on this task
router.post('/:taskId', async function (req, res) {
    if (!req.session.user_id) {
        res.redirect('/auth');
    } else {
        //display list of projects
        await journalController.newJournal(req, res);
        var [task, history] = await taskController.getTask(req, res);
        res.render('task', {task: task, history: history});

    }
});

module.exports = router;