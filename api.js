/**
 * Created by Denis Kalinichenko on 8/4/2016.
 */


// BASE SETUP
// =============================================================================

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var config = require('./app/config');
var connection = mongoose.connect(config.get("mongoose:uri"));
autoIncrement.initialize(connection);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('superSecret', config.get("secret"));

var port = config.get("port") || 8080;

// ROUTES FOR API
// =============================================================================
var router = express.Router();
var tasks = require("./app/routes/tasks");

router.use(function (req, res, next) {
    next();
});

router.get('/', function (req, res) {
    res.json({message: 'hooray! welcome to our api!'});
});

// REGISTER OUR ROUTES -------------------------------
// =============================================================================

app.use('/api', router)
    .use('/api', tasks);


// START THE SERVER
// =============================================================================

app.listen(port);
console.log('Magic happens on port ' + port);