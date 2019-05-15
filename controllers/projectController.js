var projectModel = require('../models/projectModel');
var userModel = require('../models/userModel');
var taskModel = require('../models/taskModel');

var taskController = require('../controllers/taskController');
var userController = require('../controllers/userController');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var moment = require('moment');


findDate= async function(project,tasks){
    // Détermination de la date de début de projet
    for (var j = 0; j < tasks.length; j++){
        if (j==0){
            var project_start_date=tasks[0].start_date;
        }
        var date_p=new Date(project_start_date);
        var date_c=new Date(tasks[j].start_date);
        if (date_p > date_c){
            project_start_date=tasks[j].start_date;
        }
    }
    project.diagramm_start_date = await moment(project_start_date).format('YYYY, MM-1, DD');

    // Détermination de la date de fin de projet
    for (var j = 0; j < tasks.length; j++){
        if (j==0){
            var project_due_date=tasks[0].due_date;
        }
        var date_p=new Date(project_due_date);
        var date_c=new Date(tasks[j].due_date);
        if (date_p < date_c){ project_due_date=tasks[j].due_date; }
    }
    project.diagramm_due_date = await moment(project_due_date).format('YYYY, MM-1, DD');

}

findProgress= async function(project,tasks){
    var progress=0;
    for (var j = 0; j < tasks.length; j++){
        progress=progress+tasks[j].progress;
    }
    project.progress = Math.round(progress/tasks.length);
}

findBurndown = async function(project,tasks){
    var dates = [];
    var data = [];
    for (var j = 0; j < tasks.length; j++){
        dates[2*j]=tasks[j].start_date;
        dates[2*j+1]=tasks[j].due_date;
    }

    for (var j = 0; j < dates.length; j++){
        var current=dates[j];
        var current_c=new Date(dates[j]);
        for (var i = j; i > 0  ; i--){
            if (new Date(dates[i-1]) > current_c){
                dates[i] = dates[i-1];
            }
            else{break;}
        }
        dates[i]=current;
    }

        for (var j = 0; j < dates.length; j++){
        var date_current=new Date(dates[j]);
        var current_data=0;
        for (var i = 0; i < tasks.length; i++){
            var date_start=new Date(tasks[i].start_date);
            var date_due=new Date(tasks[i].due_date);
            if (date_current<=date_due){
                if (date_current<= date_start){
                    current_data=current_data+1;
                }
                else{
                    current_data=current_data+(date_due-date_current)/(date_due-date_start);
                }
            }

        }
        data[j]=current_data/(tasks.length);
    }
    var datas=[];
    for (var j = 0; j < dates.length; j++){
        datas[j]={ date : await moment(dates[j]).format('YYYY, MM-1, DD'), value : data[j]};
        }
    project.datas=datas;
    }


// return list of projects in which logged user is implied
exports.getUserProjects = async function(req, res){
    var projects = await projectModel.find({members : req.session.user_id}).populate({path : 'members', model: userModel, select : 'firstname name'})
        .catch(function (err) {
                console.log(err);
                res.render('error', {message : 'erreur getting projects', error : err});
        });
    for (var j = 0; j < projects.length; j++){
        var tasks  =  await taskController.getProjectTasksId(projects[j]._id);
        await findDate(projects[j],tasks);
        await findProgress(projects[j],tasks);
    }
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

   await findDate(project,tasks);
   await findProgress(project,tasks);
   await findBurndown(project,tasks);

    return([project, tasks]);

};

// return the users assignees to the project
exports.getProjectUsers = async function(req, res) {
    var project = await projectModel.findById(req.params.projectId).populate({path : 'members', model: userModel, select : 'firstname name'})
            .catch(function (err) {
            console.log(err);
            res.render('error', {message: 'erreur getting users', error: err});
        });
    var users = project.members;
    return(users);

};


exports.addNewProject =
    [
        body('project_name', 'Project name required').isLength({min: 1}).trim(),
        sanitizeBody('project_name').escape(),

        body('members', 'At least one member is required').isLength({min: 1}).trim(),
        sanitizeBody('members').escape(),

        async function process(req, res) {
            if (!req.session.user_id){
                res.redirect('/auth');
            }
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                // There are errors. Render the form again with sanitized values/error messages.
                console.log('errors');
                res.render('error', {errors: errors.array()});
            } else {
                // create a new project object and save it on the db
                // is called by Post method

                var ids = [];
                var i;
                for (i = 0; i < req.body.members.length; i++) {
                    var id = await userController.getUserId(req.body.members[i].split(' '));
                    ids.push(id);
                }

                var newProject = new projectModel({
                    name : req.body.project_name,
                    members : ids
                });

                newProject.save();

                res.redirect('/project/'+newProject._id);
            }
        }
];


exports.editProject = async function(req, res){
    // get object on db, modify it and save it on the db
    // is called by Post method
    var ids = [];
    var i;
    for (i = 0; i < req.body.members.length; i++) {
        var id = await userController.getUserId(req.body.members[i].split(' '));
        ids.push(id);
    }
    var project = await projectModel.findById(req.params.projectId);

    project.name = req.body.project_name;
    project.members = ids;

    project.save();

};


exports.deleteProject =  async function(req, res) {
    // find all project tasks and delete one by one
    var tasks = await taskModel.find({project : req.params.projectId });
    var i;
    for(i = 0; i<tasks.length; i++) {
        await taskModel.findByIdAndDelete(tasks[i]._id)
            .catch(function(err) {
                res.render('error', {message: 'error on task deletion', error: err});
            });
    }
    await projectModel.findByIdAndDelete(req.params.projectId)
        .catch(function(err) {
            res.render('error', {message: 'error on project deletion', error: err});
        });
};