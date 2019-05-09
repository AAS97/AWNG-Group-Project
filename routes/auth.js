var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');


router.get('/deco', userController.auth_deco);

router.get('/', userController.auth_get);

router.post('/', userController.auth_post);



module.exports = router;
