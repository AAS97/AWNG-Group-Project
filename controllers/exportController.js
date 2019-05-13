const fs = require('fs');
const moment = require('moment');
const json2csv = require('json2csv').parse;
const path = require('path');

const json2xml = require('json2xml');
const json2xlsx = require('json2xlsx');
const mongoXlsx = require('mongo-xlsx');



exports.getExportPage = async function(req,res) {
    if (!req.session.user_id){
        res.redirect('/auth');
    }
    else{
        res.render('export',{});
    }
};

exports.exportToCsv = async function(req,res,model,fields,filename) {
    var data = await model.find({}).exec();
    let csv;
    try {
        csv =  json2csv(data,{fields});
        res.render('export_success',{});
    } catch (err) {
        return res.status(500).json({err});

    }

    var myPath = path.join(__dirname,"..","exports",filename + ".csv");
    fs.writeFile(myPath,csv, async function(err) {

        if (err) {

            return res.json(err).status(500);

        } else {


        }
    });


};

exports.exportToXml= async function(req,res,model,filename) {

    var data = await model.find({}).lean();

    try {
        var xml = json2xml(data);

        res.render('export_success',{});
    } catch (err) {
        console.log(err);
        return res.status(500).json({err});
    }

    var myPath = path.join(__dirname,"..","exports",filename + ".xml");

    fs.writeFile(myPath,xml, async function(err) {

        if (err) {
            return res.json(err).status(500);

        }
    });

};

exports.exportToJson = async function(req,res,model,filename) {
    var data = await model.find({}).exec();

    var myPath = path.join(__dirname,"..","exports",filename + ".json");

    fs.writeFile(myPath,data, async function(err) {

        if (err) {
            return res.json(err).status(500);

        }
    });

    res.render('export_success',{});

};

exports.exportToXlsx = async function(req,res,model,filename) {
    var data = await model.find({}).lean();
    try {
        mongoXlsx.mongoData2Xlsx(data, model, function(err, data) {
            console.log('File saved at:', data.fullPath);
        });

        res.render('export_success',{});
    } catch (err) {
        console.log(err);
        return res.json(err).status(500);
    }
};