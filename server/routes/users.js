(function() {
var User = require('../models/user');
var Users = require('../controllers/users');
var passport = require('passport');

module.exports = function(app, passport) {
  app.post('/users', Users.createUser);
  app.post('/users/login', Users.login);
  app.get('/users/logout', Users.logout);
  app.get('/logout', Users.loggedOut);
  app.use(Users.session);
  app.get('/users', Users.find);
  app.route('/users/:user_id')
    .get(Users.findOne)
    .put(Users.update)
    .delete(Users.delete);
};
})();
