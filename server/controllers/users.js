var User = require('../models/user');
var passport = require('passport');
	// mongoDB = require('mongodb').MongoClient;
module.exports = {
	create: function(req, res) {
		user = new User();
		user.name.first = req.body.name.first;
		user.name.last = req.body.name.last;
		user.username = req.body.username;
		user.email = req.body.email;
		user.password = req.body.password;

		user.save(function(err) {
			if (err) throw err;
			res.json({message: 'User Created'});
		});
	},

	signup: function() {
		passport.authenticate('signup', {
			successRedirect: '/user/successRedirect',
			failureRedirect: '/user/failureRedirect'
		});
	},

	login: function(){
		passport.authenticate('local', {
			successRedirect: '/user/successRedirect',
			failureRedirect: '/user/failureRedirect'
		});
	},

	success: function(req, res) {
		res.send('Logged in Successfully');
	},

	fail: function(req, res) {
		res.send('Failed to Login');
	},
};
