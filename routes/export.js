var express = require("express");
var router = express.Router();
var exportController = require("../controllers/exportController");

router.get('/',exportController.getExport);

module.exports = router;