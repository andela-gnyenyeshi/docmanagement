var User = require('../models/user');
var Users = require('../controllers/users');
var Roles = require('../models/role');
var passport = require('passport');
module.exports = function(app, passport) {
  app.post('/users', passport.authenticate('signup', {
    successRedirect: '/user/loginSuccess',
    failureRedirect: '/user/loginFailure'
  }));
  app.post('/users/login', passport.authenticate('login', {
    successRedirect: '/user/loginSuccess',
    failureRedirect: '/user/loginFailure'
  }));
  app.post('/users/logout', Users.logout);
  app.get('/users', Users.find);
  app.get('/users/:user_id', Users.findOne);
  app.put('/users/:user_id', Users.update);
  app.delete('/users/:user_id', Users.delete);

  app.get('/user/loginSuccess', function(req, res, next) {
    res.send('Logged up successfully');
  });

  app.get('/logout', function(req, res) {
    res.send('Successfully logged out');
  });

  app.get('/user/loginFailure', function(req, res, next) {
    res.send('Failed to login');
  });

  function isLoggedIn(req, res, next) {

    // If user is Authenticated
    if (req.isAuthenticated())
      return next();

    // If not, user is redirected
    res.redirect('/users');
  }
};
