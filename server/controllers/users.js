var User = require('../models/user');
module.exports = {
	create: function(req, res) {
		user = new User();
		user.name.first = req.body.name.first;
		user.name.last = req.body.name.last;
		user.email = req.body.email;
		user.password = req.body.password;

		user.save(function(err) {
			if (err) throw err;
			res.json(user);
		console.log('Hmm');
		});
	},

	login: function(req, res) {
		res.send('We shall login soon');
	},

	logout: function(req, res) {
		res.send('We are now loggin out');
	},
}