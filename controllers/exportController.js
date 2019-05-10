var express = require('express');

const fs = require('fs');
const moment = require('moment');
const json2csv = require('json2csv').parse;
const path = require('path');

const journalModel = require('../models/journalModel');
const projectModel = require('../models/projectModel');
const statusModel = require('../models/statusModel');
const taskModel = require('../models/taskModel');
const usersModel = require('../models/userModel');

exports.getExportPage = async function(req,res) {

    res.render('export',{});

};

exports.exportToCsv = async function(req,res) {
    console.log("1");
    let csv;
    try {
        csv =  json2csv(projectModel);
    } catch (err) {
        console.log(csv);
        return res.status.json({err});

    }
    console.log("2");
    fs.writeFile("../exports/database.csv",csv, async function(err) {

        if (err) {

            return res.json(err).status(500);

        } else {


        }
        console.log("3");
    });

};

exports.exportToJson = async function(req,res) {


};