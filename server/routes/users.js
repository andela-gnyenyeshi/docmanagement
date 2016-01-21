var User = require('../models/user');
var Users = require('../controllers/users');
//var Roles = require('../models/role');
var passport = require('passport');
module.exports = function(app, passport) {
  app.post('/users', Users.createUser);
  app.post('/users/login', Users.login);
  app.get('/users/logout', Users.logout);
  app.get('/users', Users.session, Users.find);
  app.get('/users/:user_id', Users.findOne);
  app.put('/users/:user_id', Users.update);
  app.delete('/users/:user_id', Users.delete);
  app.get('/loginSuccess', Users.session, Users.success);
  app.get('/logout', Users.loggedOut);
  app.get('/signupFailure', Users.signupFail);
  app.get('/loginFailure', Users.loginFail);
};
