/*!
 * nodejs-chess 
 * Copyright(c) 2016 Mikael Kall
 * MIT Licensed
 */

/**
 * Application dependencies.
 */
var http         = require('http');
var finalhandler = require('finalhandler');
var serveStatic  = require('serve-static');
var express      = require('express');        
var bodyParser   = require('body-parser');
var fs 		 = require('fs');

/**
 * Settings.
 */
var static_port = 3000
var rest_port = 3001

var serve = serveStatic(__dirname + '/public');
var server = http.createServer(function(req, res) {
  var done = finalhandler(req, res);
  serve(req, res, done);
});

/**
 * Serve static files.
 */
server.listen(static_port);
console.log('[STATIC] Listen: %s', static_port);

/**
 * Configure chess rest service.
 */
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var router = express.Router(); 
router.get('/', function(req, res) {
    res.json({ message: 'Chess REST service!' });   
});

/**
 * This REST routes will store the chessboard positions.
 * May be changed in future.
 */
router.route('/state')

    .get(function(req, res) {
        fs.readFile('/tmp/state.txt', 'utf8', function (err, data) {
            if (err) {
		res.json({ message: 'Failed' });
                return;
            }
            res.json({ message: data });
        });
    });

router.route('/state/:state_id')

    .get(function(req, res) {
	fs.writeFile("/tmp/state.txt", req.params.state_id, function(err) {
            if(err) {
                res.json({ message: req.params.state_id + ' Failed'});
	        return;
            }
            res.json({ message: req.params.state_id + ' Saved'});
        });
    });

app.use('/api', router);
app.listen(rest_port);
console.log('[REST] Listen: %s', rest_port);
