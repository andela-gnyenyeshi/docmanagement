var User = require('../models/user');
var Users = require('../controllers/users');
//var Roles = require('../models/role');
var passport = require('passport');
module.exports = function(app, passport) {
  app.post('/users', passport.authenticate('signup', {
    successRedirect: '/users/loginSuccess',
    failureRedirect: '/signupFailure'
  }));
  app.post('/users/login', passport.authenticate('login', {
    successRedirect: '/loginSuccess',
    failureRedirect: '/logFailure'
  }));
  app.get('/users/logout', Users.logout);
  app.get('/users', Users.find);
  app.get('/users/:user_id', Users.findOne);
  app.put('/users/:user_id', Users.update);
  app.delete('/users/:user_id', Users.delete);
  app.get('/loginSuccess', Users.success);
  app.get('/logout', Users.loggedOut);
  app.get('/signupFailure', Users.signupFail);
  app.get('/loginFailure', Users.loginFail);


  function isAuthorized(req, res, next) {
    // If user is Authenticated
    if (req.isAuthenticated)
      return next();
    res.redirect('/users/loginFailure');
  }
};
