var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {

  if (!req.session.user_id){
    res.redirect('/auth');
  }
  else {
    res.redirect('/user/'+req.session.user_id);
  }

});

module.exports = router;
