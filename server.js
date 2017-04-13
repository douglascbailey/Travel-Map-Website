//Base code copied from Chapter08 module02 by DCB
'use strict';

const express = require('express'), //leave http require out, as may conflict with express
    //http = require('http'),
    fs = require('fs'),
    async = require('async'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    multer = require('multer');

var app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

//app.use(bodyParser.urlencoded( {extended: false }));

function start_web_service() { 
//async.waterfall ([
//var multerObj = multer();
//console.log('The initial value of multerObjis :' + toString(multerObj));
//fs.fileReadSync('./config.json') from jsprojects webapp
console.log('Web server config file being read!!  Standby ...');

console.log('Entering readfile function now ...');
fs.readFile('config.json', 'utf8', function(err, data)  {
    if (err) {
        console.log("ERROR reading config file: " + err.code + " (" + err.message + ")");
        return;
        };
    console.log('Parsing config file into config variable ...');
    console.log("Value of data is " +JSON.stringify(data));
    const config = JSON.parse(data);
    app.use(express.static(config.webserver.folder));
    console.log("config file read; value of config is" +JSON.stringify(config));
    app.listen(config.webserver.port, function(err) {
        if (err) {
        console.log('ERROR: " + err.code + " (" + err.message + ")"');
        return;
        }
    console.log(`Web server now listening on port ${config.webserver.port}`);
    });
});
} //end of start_web_service

start_web_service(); //calls function to load web service

//Routing Instructions for service
app.get('/v1/getMap', function (req, res) {
    load_map_page(req, res)
});
app.get('/v1/wheretoform', function (req, res) {
    load_form_page(req, res)
});
app.post('/v1/getCustomMap', function (req, res) {
    //var urlEncodedParser = bodyParser.urlencoded({ extended: false });
    console.log('The POST req.body is :' + JSON.stringify(req.body));
    load_custom_map_page(req, res)
});

app.get("/", (req, res) => {
    res.redirect("/v1/getMap?Lat=39.260179&Long=-76.801616");
    res.end();
    console.log("Root request redirected to /v1/getMaps");
    });

app.get('*', four_oh_four);

function four_oh_four(req, res) {
    res.writeHead(404, { "Content-Type" : "text/html" });
    res.end("No such URL resource, please try again\n");
}

function hi_there() {
    console.log("Made it to the hi_there fuction\n")
}

function load_map_page(req, res, next) {
       //Determine what Lat and Long were requested in GET query
       //req.parsed_url = url.parse(req.url, true);
       var core_url = req.path;

       var Lat = req.query.Lat;
       if(Lat == "") {Lat = 39.26};
       console.log('The value of Lat is: ' + Lat)
       var Long = req.query.Long
       if(Long == "") {Long = -76.80};
       console.log('The value of Long is: ' + Long)
       console.log('The Lat passed is ' + Lat + ' and the Long is ' + Long + '\n');
       console.log('The req.query is ' + JSON.stringify(req.query));        

        fs.readFile('./static/index.html', (err, contents) => {
            if (err) {
            console.log("Error reading index.html file" + JSON.stringify(err));
         } else {
            var contentsLat = "";
            var contentsFinal = "";
            contents = contents.toString('utf8');
            // Replace Lat and Long
            contentsLat = contents.replace('{{Lat}}', Lat);
            contentsFinal = contentsLat.replace('{{Long}}', Long);
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(contentsFinal);
            console.log(contentsFinal);
            }
        });
}

function load_form_page(req, res, next) {

fs.readFile('./static/WhereToForm.html', (err, contents) => {
            if (err) {
            console.log("Error reading WhereToForm.html file" + JSON.stringify(err));
         } else {
            var contentsFinal = "";
            contents = contents.toString('utf8');
            // Replace Lat and Long
            contentsFinal = contents.replace('{{Error}}', "");
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(contentsFinal);
            console.log(contentsFinal);
            }
        });
}
function load_form_page_with_error(req, res, ErrorMsg) {
    
fs.readFile('../static/WhereToForm.html', (err, contents) => {
            if (err) {
            console.log("Error reading WhereToForm.html file" + JSON.stringify(err));
         } else {
            var contentsFinal = "";
            contents = contents.toString('utf8');
            // Update Error message
            contentsFinal = contents.replace('{{Error}}', ErrorMsg);
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(contentsFinal);
            console.log(contentsFinal);
            }
        });
}

function load_custom_map_page(req, res, multerObj) {
        var ErrorMsg = "";
        var Lat = req.body.Lat;
        console.log('The custom value of Lat is: ' + req.body.Lat);
        if(Lat == "" || isNaN(Lat) || Lat > 90 || Lat < -90) {
           ErrorMsg = "Latitude of " + Lat + " is not valid, please reenter coordinates";
           load_form_page_with_error(req, res, ErrorMsg);
           return
       }
       
        var Long = req.body.Long;
        console.log('The custom value of Long is: ' + req.body.Long);
        if(Long == "" || isNaN(Long) || Long > 180 || Long < -180) {
            ErrorMsg = "Longitide of " + Long + " is not valid, please reenter coordinates";
            load_form_page_with_error(req, res, ErrorMsg);
            return
        }
      
       fs.readFile('../static/index.html', (err, contents) => {
            if (err) {
            console.log("Error reading index.html file" + JSON.stringify(err));
         } else {
            var contentsLat = "";
            var contentsFinal = "";
            contents = contents.toString('utf8');
            // Replace Lat and Long
            contentsLat = contents.replace('{{Lat}}', Lat);
            contentsFinal = contentsLat.replace('{{Long}}', Long);
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(contentsFinal);
            console.log(contentsFinal);
            }
        });
}