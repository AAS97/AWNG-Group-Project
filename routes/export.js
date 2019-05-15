var express = require("express");
var router = express.Router();
var exportController = require("../controllers/exportController");

var bodyParser = require('body-parser');

var urlEncodedParser = bodyParser.urlencoded();

//importing the models

const journalModel = require('../models/journalModel');
const projectModel = require('../models/projectModel');
const statusModel = require('../models/statusModel');
const taskModel = require('../models/taskModel');
const userModel = require('../models/userModel');

//The fields are necessary for the csv convertion. Some methods exist to find the these fields automatically, but since the collections are rather simple I did not bother

const journalFields = ["id","date","entry","author","task"];
const projectFields = ["id","name","members"];
const statusFields = ["id","name"];
const taskFields = ["id","name","description","start_date","due_date","project","assignee","status"];
const userFields = ["id","name","firstname","login","password","role"];

//route to the export page
router.get('/', exportController.getExportPage);

//Post method for the export form
router.post('/', urlEncodedParser,  async function(req,res){
    if (!req.session.user_id){ //redirecting any unlogged user to the authentification page
        res.redirect('/auth');
    }
    else {

        var hasSelected = false; //Boolean to detect if a user has clicked on the submit button without selecting any collections

        if (req.body.filetype == "csv") { //Exporting every collections that were selected by the user into the chosen format


            if (req.body.projects == "projects"){

                exportController.exportToCsv(req,res,projectModel,projectFields,"projects");
                hasSelected = true;

            } if (req.body.users == "users") {

                exportController.exportToCsv(req,res,userModel,userFields,"users");
                hasSelected = true;

            } if (req.body.tasks == "tasks") {
                exportController.exportToCsv(req,res,taskModel,taskFields,"tasks");
                hasSelected = true;

            } if (req.body.statuses == "statuses") {
                exportController.exportToCsv(req, res, statusModel, statusFields,"statuses");
                hasSelected = true;

            } if (req.body.journals == "journals") {
                exportController.exportToCsv(req,res,journalModel,journalFields,"journals");
                hasSelected = true;
            }

        } else if (req.body.filetype == "json") {


            if (req.body.projects == "projects"){

                exportController.exportToJson(req,res,projectModel,"projects");
                hasSelected = true;

            } if (req.body.users == "users") {

                exportController.exportToJson(req,res,userModel,"users");
                hasSelected = true;

            } if (req.body.tasks == "tasks") {
                exportController.exportToJson(req,res,taskModel,"tasks");
                hasSelected = true;

            } if (req.body.statuses == "statuses") {
                exportController.exportToJson(req, res, statusModel, "statuses");
                hasSelected = true;

            } if (req.body.journals == "journals") {
                exportController.exportToJson(req,res,journalModel,"journals");
                hasSelected = true;

            }

        } else if (req.body.filetype == "xml") {

            if (req.body.projects == "projects"){

                exportController.exportToXml(req,res,projectModel,"projects");
                hasSelected = true;

            } if (req.body.users == "users") {

                exportController.exportToXml(req,res,userModel,"users");
                hasSelected = true;

            } if (req.body.tasks == "tasks") {
                exportController.exportToXml(req,res,taskModel,"tasks");
                hasSelected = true;

            } if (req.body.statuses == "statuses") {
                exportController.exportToXml(req, res, statusModel, "statuses");
                hasSelected = true;

            } if (req.body.journals == "journals") {
                exportController.exportToXml(req,res,journalModel,"journals");
                hasSelected = true;

            }

        } else if (req.body.filetype == "xlsx") {

            if (req.body.projects == "projects") {

                exportController.exportToXlsx(req, res, "projects");
                hasSelected = true;

            }
            if (req.body.users == "users") {

                exportController.exportToXlsx(req, res, "users");
                hasSelected = true;

            }
            if (req.body.tasks == "tasks") {
                exportController.exportToXlsx(req, res, "tasks");
                hasSelected = true;

            }
            if (req.body.statuses == "statuses") {
                exportController.exportToXlsx(req, res, "statuses");
                hasSelected = true;

            }
            if (req.body.journals == "journals") {
                exportController.exportToXlsx(req, res, "journals");
                hasSelected = true;

            }

        }

        var message; //Message to inform the user
        console.log(hasSelected);
        if (hasSelected) {

            message = "You successfully exported data !";

        } else {

            message = "You have not selected any collection to export !";

        }

        res.render('export-submitted',{message});

    }
});


module.exports = router;
