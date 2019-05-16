const fs = require('fs');
const json2csv = require('json2csv').parse;
const path = require('path');
const json2xml = require('json2xml');
const mongoXlsx = require('mongo-xlsx');


//Function to display the export web page
exports.getExportPage = async function (req, res) {
    if (!req.session.user_id) { //redirects an unlogged user to the authentification page
        res.redirect('/auth');
    } else {
        res.render('export', {}); //rendering the export page
    }
};

//Function that exports the selected collection(s) into a csv file into the "exports" folder.
exports.exportToCsv = async function (req, res, model, fields, filename) {
    var data = await model.find({}); //getting the data from the selected collection
    let csv;
    try {
        csv = json2csv(data, {fields}); //converts the json data into csv data
    } catch (err) {
        return res.status(500).json({err});

    }

    var myPath = path.join(__dirname, "..", "exports", filename + ".csv"); //path to the exports folder
    fs.writeFile(myPath, csv, async function (err) { //writing the csv data into a file

        if (err) {

            return res.json(err).status(500);

        } else {


        }
    });


};

//Function that exports the selected collection(s) into a xml file into the "exports" folder.
exports.exportToXml = async function (req, res, model, filename) {

    var data = await model.find({}).lean(); //getting the data into the selected collection and removing any useless information from it (with the lean method)

    try {
        var xml = json2xml(data); //converts the json data into xml data

    } catch (err) {
        console.log(err);
        return res.status(500).json({err});
    }

    var myPath = path.join(__dirname, "..", "exports", filename + ".xml"); //path to the exports folder

    fs.writeFile(myPath, xml, async function (err) { //writing the xml data into a file

        if (err) {
            return res.json(err).status(500);

        }
    });

};


//Function that exports the selected collection(s) into a json file into the "exports" folder.
exports.exportToJson = async function (req, res, model, filename) {
    var data = await model.find({}); //getting the data into the selected collection

    var myPath = path.join(__dirname, "..", "exports", filename + ".json"); //path to the exports folder

    await fs.writeFile(myPath, data, async function (err) { //writing the json data into a file

        if (err) {
            return res.json(err).status(500);

        }
    });

};


//Function that exports the selected collection(s) into a xlsx file.
exports.exportToXlsx = async function (req, res, model, filename) {

    var data = await model.find({});
    var dynamicModel = mongoXlsx.buildDynamicModel(data); //mongoXlsx requires a specific syntax for the model that will me provided by the buildDynamicModel method
    console.log(dynamicModel);
    console.log(data);

    mongoXlsx.mongoData2Xlsx(data, dynamicModel, function (err, data) {
        console.log('File saved at:', data.fullPath);
    });

};