var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

/* GET home page. */
router.get('/', userController.auth_get);

router.post('/', userController.auth_post);



module.exports = router;
