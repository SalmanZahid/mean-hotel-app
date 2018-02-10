require('./api/data/db');
var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require('body-parser');

var routes = require('./api/routes');
var settings = require('./api//settings/appSettings');

app.use('/api',settings.verifyToken);


// SET STATIC FOLDER BEFORE ROUTING
app.use(express.static(path.join(__dirname,'public')));
app.use('/node_modules',express.static( __dirname + '/node_modules'));
app.use('/fonts',express.static( __dirname + '/fonts'));

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define routes
app.use('/api', routes);

app.get('/',function(req, res){
    res.sendFile(path.join(__dirname,'public','index.html'));
});

// SET AND LISTEN TO PORT
app.set('port', 3000);
app.listen(app.get('port'));

