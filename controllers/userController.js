/*
    This file contains all the functions regarding user management.
 */

var userModel = require('../models/userModel');
var projectModel = require('../models/projectModel');


var projectController = require('../controllers/projectController');
var taskController = require('../controllers/taskController');

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');


//Function to display auth form
exports.auth_get = function (req, res) {
    res.render('authentify');
};

//function to manage logout
exports.auth_deco = function (req, res) {
    req.session.destroy();
    res.render('authentify');
};

//FUnction to authentify user on form entry
exports.auth_post =
    [
        //Sanitize form entries
        body('username', 'Username required').isLength({min: 1}).trim(),
        sanitizeBody('username').escape(),

        body('password', 'Password required').isLength({min: 1}).trim(),
        sanitizeBody('password').escape(),

        async function (req, res) {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // There are errors. Render the form again with sanitized values/error messages.
                console.log('errors');
                res.render('error', {errors: errors.array()});
            } else {

                // Data from form is valid.
                // Check if valid logins.
                userModel.findOne({'login': req.body.username, 'password': req.body.password})
                    .exec(async function (err, found_user) {
                        if (err) {
                            res.render('authentify', {errors: [{msg: 'erreur de recherche dans la base de donnée'}]})
                        }

                        if (found_user) {
                            // user exists, redirect to its detail page.
                            req.session.user_id = found_user._id;
                            res.redirect('/users/' + found_user._id);
                        } else {

                            res.render('authentify', {errors: [{msg: "invalid login"}]});
                        }

                    });
            }
        }
    ];


//Function to add new user on form post
exports.addNewUser = [
    body('name', 'Name required').isLength({min: 1}),
    sanitizeBody('username').escape(),

    body('firstname', 'Firstname required').isLength({min: 1}),
    sanitizeBody('username').escape(),

    body('username', 'Username required').isLength({min: 1}),
    sanitizeBody('username').escape(),

    body('password1', 'Password required').isLength({min: 1}),
    sanitizeBody('password').escape(),

    body('password2', 'Password required').isLength({min: 1}),
    sanitizeBody('password').escape(),

    async function (req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('error', {errors: errors.array()});
        } else {
            //Make sure password is ok.
            if (req.body.password1 != req.body.password2) {
                res.render('new_user', {errors: [{msg: "Passwords do not match"}], data: req.body});
            } else {// Check if user exists
                var test = userModel.findOne({name: req.body.name, firstname: req.body.firstname}).catch();
                if (test.length) {
                    res.render('new_user', {errors: [{msg: "User already exists"}]});
                } else {
                    //create new user document and add it to the db.
                    var newUser = new userModel({
                        name: req.body.name,
                        firstname: req.body.firstname,
                        login: req.body.username,
                        password: req.body.password1,
                        role: ['member']

                    });
                    newUser.save();

                    req.session.user_id = newUser._id;
                    res.redirect('/users/' + newUser._id);


                }
            }
        }
    }

];


//Function to display dashboard Page
exports.get_home = async function (req, res) {

    //get user object
    await userModel.findById(req.session.user_id)
        .exec(function (err, user) {
            if (err) {
                console.log(res.render('error', {message: 'erreur de recherche dans la base de donnée', error: err}));
            } else {
                console.log(user.firstname + ' connected');
            }
        });

    var projects = await projectController.getUserProjects(req, res);
    var mytasks = await taskController.getUserTasks(req, res);
    var myfinishedtasks = await taskController.getUserFinishedTasks(req, res);
    var othersUsersTasks = await taskController.getOtherUserTasks(req, res);


    res.render('dashboard', {
        projects: projects,
        mytasks: mytasks,
        myfinishedtasks: myfinishedtasks,
        othersUsersTasks: othersUsersTasks,
        task: mytasks[0]
    });

};


//Function listing all user of the app
exports.getAllUsers = async function (req, res, callback) {

    var members = await userModel.find().select('name firstname')
        .catch(function (err) {
            console.log(res.render('error', {
                message: 'erreur de recherche des utilisateurs dans la base de donnée',
                error: err
            }));
        });
    return (members);
};


//Function to get user Id on name and firstname
exports.getUserId = async function ([firstname, name]) {
    var member = await userModel.findOne({name: name, firstname: firstname})
        .catch(function (err) {
            console.log(res.render('error', {
                message: 'erreur de recherche des utilisateurs dans la base de donnée',
                error: err
            }));
        });
    return member._id;
};

//Function to get all user except project one
exports.allUserExceptProjectMembers = async function (req, res) {

    var project = await projectModel.findById(req.params.projectId).select('members')
        .catch(function (err) {
            console.log(res.render('error', {message: 'error while looking for members', error: err}));
        });
    var other_users = await userModel.find({_id: {$nin: project.members}}).select('name firstname')
        .catch(function (err) {
            console.log(res.render('error', {message: 'error while looking for members', error: err}));
        });

    return (other_users);

};
