var express = require("express");
var router = express.Router();
var exportController = require("../controllers/exportController");

var bodyParser = require('body-parser');

var urlEncodedParser = bodyParser.urlencoded();

router.get('/',exportController.getExportPage);

router.post('/', urlEncodedParser, async function(req,res) {

    if (req.body.filetype == "csv") {
        
        exportController.exportToCsv();

    } else if (req.body.filetype == "jsontype") {

        exportController.exportToJson();

    }

});


module.exports = router;
