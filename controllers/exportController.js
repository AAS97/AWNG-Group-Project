const fs = require('fs');
const moment = require('moment');
const json2csv = require('json2csv').parse;
const path = require('path');






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

exports.exportToJson = async function(req,res) {


};