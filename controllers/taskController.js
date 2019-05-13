

var taskModel = require('../models/taskModel');
var userModel = require('../models/userModel');
var statusModel = require('../models/statusModel');
var projectModel = require('../models/projectModel');


var journalController = require('../controllers/journalController');
var userController = require('../controllers/userController');

var moment = require('moment');

// return list of projects in which logged user is implied
exports.getUserTasks = async function(req, res){
    var tasks = await taskModel.find({assignee : req.session.user_id})
        .populate({path : 'assignee', model: userModel, select : 'firstname name'})
        .populate({path : 'project', model : projectModel, select :'name'})
        .populate({path: 'status', model : statusModel})
        .catch(function (err) {
                console.log(err);
                res.render('error', {message : 'error getting all user tasks', error : err});
        });

    for (var j = 0; j < tasks.length; j++){
        tasks[j].formatted_start_date = await moment(tasks[j].start_date).format('YYYY-MM-DD');
        tasks[j].formatted_due_date = await moment(tasks[j].due_date).format('YYYY-MM-DD');
    }

    return(tasks);

};

exports.getOtherUserTasks = async function(req, res){
    var tasks = await taskModel.find({assignee : {$ne: req.session.user_id}})
        .populate({path : 'assignee', model: userModel, select : 'firstname name'})
        .populate({path : 'project', model : projectModel, select :'name'})
        .populate({path: 'status', model : statusModel})
        .catch(function (err) {
            console.log(err);
            res.render('error', {message : 'erreur getting projects', error : err});
        });

    for (var j = 0; j < tasks.length; j++){
        tasks[j].formatted_start_date = await moment(tasks[j].start_date).format('YYYY-MM-DD');
        tasks[j].formatted_due_date = await moment(tasks[j].due_date).format('YYYY-MM-DD');
    }

    return(tasks);

};


exports.getUserFinishedTasks = async function(req, res){
    var status  = await statusModel.findOne({name : 'Terminé'})
        .catch(function (err) {
            console.log(err);
            res.render('error', {message: 'erreur getting status', error: err});
        });
    var tasks = await taskModel.find({assignee : req.session.user_id, status: status._id})
        .populate({path : 'assignee', model: userModel, select : 'firstname name'})
        .populate({path : 'project', model : projectModel, select :'name'})
        .populate({path: 'status', model : statusModel})
        .catch(function (err) {
            console.log(err);
            res.render('error', {message : 'error getting finished tasks', error : err});
        });

    for (var j = 0; j < tasks.length; j++){
        tasks[j].formatted_start_date = await moment(tasks[j].start_date).format('YYYY-MM-DD');
        tasks[j].formatted_due_date = await moment(tasks[j].due_date).format('YYYY-MM-DD');
    }
    return(tasks);

};

exports.getProjectTasks = async function(req, res){
   var tasks = await taskModel.find({project : req.params.projectId})
        .populate({path : 'assignee', model: userModel, select : 'firstname name'})
        .populate({path: 'status', model : statusModel})
        .catch(function (err) {
                console.log(err);
                res.render('error', {message : 'error getting project tasks', error : err});
        });

    for (var j = 0; j < tasks.length; j++){
        tasks[j].formatted_start_date = await moment(tasks[j].start_date).format('YYYY-MM-DD');
        tasks[j].formatted_due_date = await moment(tasks[j].due_date).format('YYYY-MM-DD');
    }

    return(tasks);

};

// return details about a project
exports.getTask = async function(req, res) {
    var task = await taskModel.findById(req.params.taskId)
        .populate({path : 'assignee', model: userModel, select : 'firstname name'})
        .populate({path: 'status', model : statusModel, select : 'name'})
        .populate({path: 'project', model : projectModel, select : 'name _id'})
        .catch(function (err) {
                console.log(err);
                res.render('error', {message : 'error getting task', error : err});
        });

    task.formatted_start_date = await moment(task.start_date).format('YYYY-MM-DD');
    task.formatted_due_date = await moment(task.due_date).format('YYYY-MM-DD');

    var journals = await journalController.getTaskJournals(req, res);


    return ([task,journals]);

};


exports.addNewTask = async function(req, res){
    // create a new task object and save it on the db
    // is called by Post method
    var status = await statusModel.findOne({name : req.body.status})
        .catch(function(err) {
            res.render('error', {message: 'error on status search in database', error: err});
        });
    var split = req.body.assignee.split(' ');
    var userId = await userController.getUserId(split);

    var newTask = new taskModel({
        name : req.body.task_name,
        description : req.body.task_descr,
        start_date : req.body.start_date,
        due_date : req.body.due_date,
        project : req.params.projectId,
        status : status._id,
        assignee : userId,

    });

    newTask.save();

};

exports.editTask = async function(req, res){
    // create a new task object and save it on the db
    // is called by Post method
    var status = await statusModel.findOne({name : req.body.status})
        .catch(function(err) {
            res.render('error', {message: 'error on status search in database', error: err});
        });
    var split = req.body.assignee.split(' ');
    var userId = await userController.getUserId(split);

    var task = await taskModel.findById(req.params.taskId);

    task.name = req.body.task_name;
    task.description = req.body.task_descr;
    if(req.body.start_date){
        task.start_date = req.body.start_date;
    }
    if(req.body.start_date){
        task.due_date = req.body.due_date;
    }
    task.status = status._id;
    task.assignee = userId;

    task.save();

};

exports.deleteTask = async function(req, res) {
    await taskModel.findByIdAndDelete(req.params.taskId)
        .catch(function(err) {
        res.render('error', {message: 'error on task deletion', error: err});
    });

};

//return de status that a task can have
exports.getAllStatus = async function(req, res) {
    var project = await projectModel.findById(req.params.projectId).populate({path : 'members', model: userModel, select : 'firstname name'})
        .catch(function (err) {
            console.log(err);
            res.render('error', {message: 'error getting projects', error: err});
        });
    var status = await statusModel.find();
    return(status);

};