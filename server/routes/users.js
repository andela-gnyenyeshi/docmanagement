(function() {
  'use strict';
  var Users = require('../controllers/users');

  module.exports = function(app) {
    app.post('/api/users/login', Users.login);
    app.get('/api/users/logout', Users.session, Users.logout);
    app.get('/api/logout', Users.loggedOut);
    app.route('/api/users')
      .post(Users.createUser)
      .get(Users.session, Users.find);
    app.use(Users.session);
    app.route('/api/users/:user_id')
      .get(Users.findOne)
      .put(Users.update)
      .delete(Users.delete);
    app.get('/api/users/:user_id/documents', Users.getDocs);
  };
})();
