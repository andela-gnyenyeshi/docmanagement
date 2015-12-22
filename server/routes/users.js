var express = require('express'),
	User = require('../controllers/users'),
	router = express.Router();

router.route('/login').post(User.login)
	.get(User.login);

router.route('/logout').post(User.logout)
	.get(User.logout);

router.route('/users').post(User.create)
	.get(User.login);

router.route('/users/:user_id').get(User.login)
	.put(User.logout);


module.exports = router;

