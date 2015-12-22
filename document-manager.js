// Require dependencies
var express = require('express'),
		bodyParser = require('body-parser'),
		port = process.env.PORT || 4040,
		mongoose = require('mongoose'),
		config = require('./config'),
		routes = require('./server/routes/users')
		User = require('./server/models/user'),

		// Watches for code changes
		supervisor = require('supervisor'),

// Environment
		app = express();
		app.use(bodyParser.urlencoded({extended: true}));
		app.use(bodyParser.json());
		app.use('/users', routes);

// Connect to the database
mongoose.connect(config.db, function(err) {
	if (err) {
		console.log('Error connecting to the db');
	} else {
		console.log('DB connection successful');
	}
});

// Listen to port
app.listen(port, function() {
	console.log('Listening on port: ' + port);
});
