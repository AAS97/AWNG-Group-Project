var projectModel = require('../models/projectModel');
var userModel = require('../models/userModel');

var taskController = require('../controllers/taskController');
var userController = require('../controllers/userController');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var moment = require('moment');

//Fonction déterminant la date de début et de fin d'un projet, et la date du jour
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

    //Ajout de la date du jour
    var today = new Date();
    project.today= await moment(today).format('YYYY, MM-1, DD');
}


//Fonction déterminant l'avancement d'un projet
findProgress= async function(project,tasks){
    var progress=0;
    for (var j = 0; j < tasks.length; j++){
        progress=progress+tasks[j].progress;
    }
    project.progress = Math.round(progress/tasks.length);
}

//Fonction permettant de construire un diagramme d'avancement
findBurndown = async function(project,tasks){

    //Récupère l'ensemble des dates de début et de fin des tâches
    var dates = [];
    for (var j = 0; j < tasks.length; j++){
        dates[2*j]=tasks[j].start_date;
        dates[2*j+1]=tasks[j].due_date;
    }

    // Trie ces dates par ordre chronologique par tri par insertion
    for (var j = 0; j < dates.length; j++){
        var current=dates[j];
        var current_c=new Date(dates[j]);
        for (var i = j; i > 0  ; i--){
            if (new Date(dates[i-1]) > current_c){ dates[i] = dates[i-1];}
            else{break;}
        }
        dates[i]=current;
    }

    // Détermine l'avancement attendu pour chacune des dates de ci-dessus en considérant que
    // chaque tâche a le même poids et que l'avancement dans une tâche suit une loi linéaire
    var data = [];
    for (var j = 0; j < dates.length; j++){
        var date_current=new Date(dates[j]);
        var current_data=0;
        for (var i = 0; i < tasks.length; i++){
            var date_start=new Date(tasks[i].start_date);
            var date_due=new Date(tasks[i].due_date);
            if (date_current<=date_due){
                // Si la date n'est pas commencée il reste 100% du travail à faire
                if (date_current<= date_start){ current_data=current_data+1;}
                // Si on est en cours de réalisation, on suit une loi linéaire
                else{current_data=current_data+(date_due-date_current)/(date_due-date_start);}
            }

        }
        data[j]=current_data/(tasks.length);
    }

    // Insére en attribut du projet ces données d'avancement comme une liste de couple
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