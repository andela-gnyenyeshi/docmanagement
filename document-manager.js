// Require dependencies
var express = require('express'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
	port = process.env.PORT || 4040,
	mongoose = require('mongoose'),
	config = require('./config/config'),
	routes = require('./server/routes/users'),
  passport = require('passport'),
	User = require('./server/models/user'),
  Strategy = require('./config/local-strategy'),

	// Watches for code changes
	supervisor = require('supervisor'),

// Passport
  passport = require('passport'),
  session = require('express-session'),

// Environment
app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: 'secret', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());


routes(app, passport);
Strategy(passport);

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
