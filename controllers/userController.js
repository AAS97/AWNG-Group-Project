var userModel = require('../models/userModel');
var projectController = require('../controllers/projectController');
var userController = require('../controllers/userController');
var taskController = require('../controllers/taskController');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');



exports.auth_get = function(req, res) {
    res.render('authentify');
};

exports.auth_deco = function(req, res) {
    req.session.destroy();
    res.render('authentify');
};

exports.auth_post =
    [
    body('username', 'Username required').isLength({ min: 1 }).trim(),
    sanitizeBody('username').escape(),

    body('password', 'Password required').isLength({ min: 1 }).trim(),
    sanitizeBody('password').escape(),

    async function(req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            console.log('errors');
            res.render('error', {errors: errors.array()});
            return;
        }
        else {

            // Data from form is valid.
            // Check if valid logins.
            userModel.findOne({'login': req.body.username, 'password' : req.body.password })
                .exec( async function(err, found_user) {
                    if (err) { res.render('authentify', {errors : [{msg : 'erreur de recherche dans la base de donnée'}]})}

                    if (found_user) {
                        // user exists, redirect to its detail page.
                        req.session.user_id = found_user._id;
                        res.redirect('/users/'+found_user._id);
                    }
                    else {

                        res.render('authentify', {errors : [{msg:"invalid login"}]});
                    }

                });
        }
    }
    ];

exports.get_home = async function(req, res) {

    //get user object
    await userModel.findById(req.session.user_id)
        .exec(function (err, user) {
        if (err) {console.log(res.render('error', {message : 'erreur de recherche dans la base de donnée', error : err})); }
        else {
            console.log(user.firstname + ' connected');
        }
    });

    var projects = await projectController.getUserProjects(req,res);
    var mytasks = await taskController.getUserTasks(req,res);
    var myfinishedtasks = await taskController.getUserFinishedTasks(req,res);
    var othersUsersTasks = await taskController.getOtherUserTasks(req,res);




    res.render('dashboard',{projects: projects, mytasks: mytasks, myfinishedtasks: myfinishedtasks, othersUsersTasks: othersUsersTasks});

};

exports.getAllUsers = async function(req, res, callback){

    var members = await userModel.find().select('name firstname')
        .catch(function(err){
            console.log(res.render('error', {message : 'erreur de recherche des utilisateurs dans la base de donnée', error : err}));
    });
    return(members);
};

exports.getUserId = async function([firstname, name]){
    var member = await userModel.findOne({name : name, firstname : firstname})
        .catch(function(err){
            console.log(res.render('error', {message : 'erreur de recherche des utilisateurs dans la base de donnée', error : err}));
        });
    return member._id;
};


