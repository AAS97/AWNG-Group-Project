/*
    Manage /project/ routes i.e. project control
 */


var express = require('express');
var router = express.Router();

var statusModel = require('../models/statusModel');


var projectController = require('../controllers/projectController');
var userController = require('../controllers/userController');
var taskController = require('../controllers/taskController');

var moment = require('moment');


//List all projects
router.get('/', async function (req, res) {
    if (!req.session.user_id) {
        res.redirect('/auth');
    } else {
        //display list of projects
        var projects = await projectController.getUserProjects(req, res);
        res.render('list_projects', {object: projects});

    }

});

//Render new project form
router.get('/add', async function (req, res) {
    if (!req.session.user_id) {
        res.redirect('/auth');
    } else {
        //display new project form
        var members = await userController.getAllUsers(req, res);
        res.render('new_project', {members: members});
    }
});

//Add new project on form post
router.post('/add', projectController.addNewProject);


//Display new task form on this project
router.get('/:projectId/add', async function (req, res) {
    if (!req.session.user_id) {
        res.redirect('/auth');
    } else {
        //display new task form
        var [project, tasks] = await projectController.getProject(req, res);
        var status = await statusModel.find({name: {$ne: "Nouveau"}}).exec();
        res.render('new_task', {object: project, status: status});

    }
});

//Add new task to the project
router.post('/:projectId/add', async function (req, res) {
    if (!req.session.user_id) {
        res.redirect('/auth');
    } else {
        //get form results
        await taskController.addNewTask(req, res);
        var [project, tasks] = await projectController.getProject(req, res);
        res.render('project', {project: project, tasks: tasks});
    }
});

//Display form to modify the project
router.get('/:projectId/modify', async function (req, res) {
    if (!req.session.user_id) {
        res.redirect('/auth');
    } else {
        //display modify form
        var [project, tasks] = await projectController.getProject(req, res);
        res.render('modify_project', {project: project});

    }
});

//Modify the project on form post
router.post('/:projectId/modify', async function (req, res) {
    if (!req.session.user_id) {
        res.redirect('/auth');
    } else {
        await projectController.editProject(req, res);
        res.redirect('/project/' + req.params.projectId);
    }
});

//Delete the project
router.get('/:projectId/delete', async function (req, res) {
    if (!req.session.user_id) {
        res.redirect('/auth');
    } else {
        await projectController.deleteProject(req, res);
        res.redirect('/project/');
    }
});

//Get detail page of the project
router.get('/:projectId', async function (req, res) {
    if (!req.session.user_id) {
        res.redirect('/auth');
    } else {
        //display list of projects details
        var users = await projectController.getProjectUsers(req, res);
        var status = await taskController.getAllStatus(req, res);
        var [project, tasks] = await projectController.getProject(req, res);
        res.render('project', {project: project, tasks: tasks, users: users, status: status});

    }
});


module.exports = router;