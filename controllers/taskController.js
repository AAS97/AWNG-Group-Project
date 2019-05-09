var taskModel = require('../models/taskModel');
var userModel = require('../models/userModel');
var statusModel = require('../models/statusModel');
var projectModel = require('../models/projectModel');

var journalController = require('../controllers/journalController');
var userController = require('../controllers/userController');

// return list of projects in which logged user is implied
exports.getUserTasks = async function(req, res){
    var tasks = await taskModel.find({assignee : req.session.user_id})
        .populate({path : 'assignee', model: userModel, select : 'firstname name'})
        .populate({path : 'project', model : projectModel, select :'name'})
        .populate({path: 'status', model : statusModel})
        .catch(function (err) {
                console.log(err);
                res.render('error', {message : 'erreur getting projects', error : err});
        });
    return(tasks);

};

exports.getProjectTasks = async function(req, res){
   var tasks = await taskModel.find({project : req.params.projectId})
        .populate({path : 'assignee', model: userModel, select : 'firstname name'})
        .populate({path: 'status', model : statusModel})
        .catch(function (err) {
                console.log(err);
                res.render('error', {message : 'erreur getting tasks', error : err});
        });
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
                res.render('error', {message : 'erreur getting task', error : err});
        });
    var journals = await journalController.getTaskJournals(req, res);

    return ([task,journals]);

};
/*
// return details about a project
exports.getTask = function(req, res, callback) {
    taskModel.findById(req.params.taskId)
        .populate({path : 'assignee', model: userModel, select : 'firstname name'})
        .populate({path: 'status', model : statusModel, select : 'name'})
        .populate({path: 'project', model : projectModel, select : 'name _id'})
        .exec(function (err, task) {
            if (err) {
                console.log(err);
                res.render('error', {message : 'erreur getting task', error : err});
            }else {
                journalController.getTaskJournals(req, res, function(journals) {
                    if (typeof callback == "function") {
                        callback(task, journals);
                    }
                });
            }
        });

};
*/
exports.addNewTask = async function(req, res){
    // create a new task object and save it on the db
    // is called by Post method
    var status = await statusModel.findOne({name : req.body.status})
        .catch(function(err) {
            res.render('error', {message: 'erreur de recherche de status dans la base de donnée', error: err});
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
            res.render('error', {message: 'erreur de recherche de status dans la base de donnée', error: err});
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