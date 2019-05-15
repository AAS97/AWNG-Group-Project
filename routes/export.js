var express = require("express");
var router = express.Router();
var exportController = require("../controllers/exportController");

var bodyParser = require('body-parser');

var urlEncodedParser = bodyParser.urlencoded();

const journalModel = require('../models/journalModel');
const projectModel = require('../models/projectModel');
const statusModel = require('../models/statusModel');
const taskModel = require('../models/taskModel');
const userModel = require('../models/userModel');

const journalFields = ["id","date","entry","author","task"];
const projectFields = ["id","name","members"];
const statusFields = ["id","name"];
const taskFields = ["id","name","description","start_date","due_date","project","assignee","status"];
const userFields = ["id","name","firstname","login","password","role"];

router.get('/', exportController.getExportPage);

router.post('/', urlEncodedParser,  async function(req,res){
    if (!req.session.user_id){
        res.redirect('/auth');
    }
    else {



        if (req.body.filetype == "csv") {

            if (req.body.projects == "projects"){

                exportController.exportToCsv(req,res,projectModel,projectFields,"projects");

            } if (req.body.users == "users") {

                exportController.exportToCsv(req,res,userModel,userFields,"users");

            } if (req.body.tasks == "tasks") {
                exportController.exportToCsv(req,res,taskModel,taskFields,"tasks");

            } if (req.body.statuses == "statuses") {
                exportController.exportToCsv(req, res, statusModel, statusFields,"statuses");

            } if (req.body.journals == "journals") {
                exportController.exportToCsv(req,res,journalModel,journalFields,"journals");

            }

        } else if (req.body.filetype == "json") {



            if (req.body.projects == "projects"){

                exportController.exportToJson(req,res,projectModel,"projects");

            } if (req.body.users == "users") {

                exportController.exportToJson(req,res,userModel,"users");

            } if (req.body.tasks == "tasks") {
                exportController.exportToJson(req,res,taskModel,"tasks");

            } if (req.body.statuses == "statuses") {
                exportController.exportToJson(req, res, statusModel, "statuses");

            } if (req.body.journals == "journals") {
                exportController.exportToJson(req,res,journalModel,"journals");

            }

        } else if (req.body.filetype == "xml") {

            if (req.body.projects == "projects"){

                exportController.exportToXml(req,res,projectModel,"projects");

            } if (req.body.users == "users") {

                exportController.exportToXml(req,res,userModel,"users");

            } if (req.body.tasks == "tasks") {
                exportController.exportToXml(req,res,taskModel,"tasks");

            } if (req.body.statuses == "statuses") {
                exportController.exportToXml(req, res, statusModel, "statuses");

            } if (req.body.journals == "journals") {
                exportController.exportToXml(req,res,journalModel,"journals");

            }

        } else if (req.body.filetype == "xlsx") {

            if (req.body.projects == "projects") {

                exportController.exportToXlsx(req, res, projectModel, "projects");

            }
            if (req.body.users == "users") {

                exportController.exportToXlsx(req, res, userModel, "users");

            }
            if (req.body.tasks == "tasks") {
                exportController.exportToXlsx(req, res, taskModel, "tasks");

            }
            if (req.body.statuses == "statuses") {
                exportController.exportToXlsx(req, res, statusModel, "statuses");

            }
            if (req.body.journals == "journals") {
                exportController.exportToXlsx(req, res, journalModel, "journals");

            }
        }

    }
});


module.exports = router;
