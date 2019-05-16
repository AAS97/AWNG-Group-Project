/*
    Manage /auth/ routes i.e. user control
 */

var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

// Deconnexion
router.get('/deco', userController.auth_deco);

//Auth
router.get('/', userController.auth_get);

//Login post
router.post('/', userController.auth_post);

//New user form display
router.get('/add', async function (req, res) {
    res.render('new_user');
});

//Get new user form
router.post('/add', userController.addNewUser);


module.exports = router;
