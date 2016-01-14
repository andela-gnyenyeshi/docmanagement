var User = require('../models/user');
var Users = require('../controllers/users');
var passport = require('passport');
module.exports = function(app, passport) {
	// app.post('/user/signup', Users.signup);
	app.post('/users', passport.authenticate('signup', {
		successRedirect: '/user/loginSuccess',
		failureRedirect: '/user/loginFailure'
	}));
	app.post('/users/login', passport.authenticate('login', {
		successRedirect: '/user/loginSuccess',
		failureRedirect: '/user/loginFailure'
		})
	);

	app.post('/users/logout', function(req, res) {});
	app.get('/users', function(req, res) {});
	app.get('/users/:id', function(req, res){});
	app.put('/users/:id', function(req, res) {});
	app.delete('/users/:id', function(req, res) {});


	app.get('/home', function(req, res) {
		res.send('hELLO');
	});

	app.get('/user/loginSuccess', function(req, res, next) {
		res.send('Logged up successfully');
	});

	app.get('/user/loginFailure', function(req, res, next) {
		res.send('Failed to login');
	});
};
