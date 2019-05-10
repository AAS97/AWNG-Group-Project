var projectModel = require('../models/projectModel');
var userModel = require('../models/userModel');

var taskController = require('../controllers/taskController');
var userController = require('../controllers/userController');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// return list of projects in which logged user is implied
exports.getUserProjects = async function(req, res){
    var projects = await projectModel.find({members : req.session.user_id}).populate({path : 'members', model: userModel, select : 'firstname name'})
        .catch(function (err) {
                console.log(err);
                res.render('error', {message : 'erreur getting projects', error : err});
        });
    return(projects);
};

// return details about a project
exports.getProject = async function(req, res) {
   var project = await projectModel.findById(req.params.projectId).populate({path : 'members', model: userModel, select : 'firstname name'})
        .catch(function (err) {
            console.log(err);
            res.render('error', {message: 'erreur getting projects', error: err});
        });
   var tasks = await taskController.getProjectTasks(req, res);
   return([project, tasks]);

};

// return the users assignees to the project
exports.getProjectUsers = async function(req, res) {
    var project = await projectModel.findById(req.params.projectId).populate({path : 'members', model: userModel, select : 'firstname name'})
        .catch(function (err) {
            console.log(err);
            res.render('error', {message: 'erreur getting users', error: err});
        });
    var users = await userModel.find();
    console.log("Users"+ users);
    return(users);

};


/*

exports.addNewProject = async function(req, res) {

    body('project_name', 'Project name required').isLength({min: 1}).trim();
    sanitizeBody('project_name').escape();

    body('members', 'At least one member is required').isLength({min: 1}).trim();
    sanitizeBody('members').escape();


    async function process(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            console.log('errors');
            res.render('error', {errors: errors.array()});
            return;
        } else {
            // create a new project object and save it on the db
            // is called by Post method

            var ids = [];
            var i;
            for(i = 0; i<req.body.members.length; i++){
               var split = req.body.members[i].split(' ');
               await userController.getUserId(split, function (id){
                   ids.push(id);
                });
            }


        }
    };
    process(req, res);
};


 */