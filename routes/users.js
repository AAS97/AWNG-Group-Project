var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');


// Display dashboard
router.get('/:_id', (req, res) => {
    if (!req.session.user_id) {
        res.redirect('/');
    } else {
        userController.get_home(req, res);
    }
});

router.post('/:_id', (req, res) => {
    res.redirect('/auth')
});

//redirect
router.get('/', (req, res) => {
    if (!req.session.user_id) {
        res.redirect('/');
    } else {
        res.redirect('/users/' + req.session.user_id);
    }
});


module.exports = router;
