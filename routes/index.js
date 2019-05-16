/*
    Manage / route and redirect
 */


var express = require('express');
var router = express.Router();

//redirect to wanted page
router.get('/', function (req, res) {

    if (!req.session.user_id) {
        res.redirect('/auth');
    } else {
        res.redirect('/users/' + req.session.user_id);
    }

});

module.exports = router;
