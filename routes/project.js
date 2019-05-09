var express = require('express');
var router = express.Router();

var statusModel = require('../models/statusModel');
var projectController = require('../controllers/projectController');
var userController = require('../controllers/userController');
var taskController = require('../controllers/taskController');

/* GET home page. */
router.get('/', async function(req, res) {
    if (!req.session.user_id){
        res.redirect('/auth');
    }
    else {
        //display list of projects
       var projects = await projectController.getUserProjects(req,res);
       res.render('list_projects',{object : projects});

    }

});

router.get('/add', async function(req, res){
   if (!req.session.user_id){
       res.redirect('/auth');
    }
    else {
        //display new project form
        var members = await userController.getAllUsers(req, res);
        res.render('project_form', {members : members});
    }
});

router.post('/add', function(req, res){
    if (!req.session.user_id){
        res.redirect('/auth');
    }
    else {
        projectController.addNewProject(req, res);
    }
});

router.get('/:projectId/add', async function(req,res){
    if (!req.session.user_id){
        res.redirect('/auth');
    }
    else {
        //display new task form
       var [project, tasks] = await projectController.getProject(req,res);
       var status = await statusModel.find().exec();
       res.render('new_task',{object : project, status : status});

    }
});

router.post('/:projectId/add', async function(req,res){
    if (!req.session.user_id){
        res.redirect('/auth');
    }
    else {
        //get form results
        await taskController.addNewTask(req, res);
        var [project, tasks] = await projectController.getProject(req,res);
        res.render('project',{object : project, tasks : tasks});
    }
});

router.get('/:projectId',async function(req, res) {
    if (!req.session.user_id){
        res.redirect('/auth');
    }
    else {
        //display list of projects
        var [project, tasks] = await projectController.getProject(req,res);
        res.render('project',{object : project, tasks : tasks});

    }});


module.exports = router;