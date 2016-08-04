/**
 * Created by Denis Kalinichenko on 8/4/2016.
 */


// BASE SETUP
// =============================================================================

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var config = require('./app/config');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = config.get("port") || 8080;
app.set('superSecret', config.get("secret"));

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);