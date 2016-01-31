(function() {
  'use strict';
  var Roles = require('../controllers/roles');

  module.exports = function(app) {
    app.post('/roles/superadmin', Roles.createOne);
    app.use(Roles.session);
    app.route('/roles')
      .post(Roles.create)
      .get(Roles.find);

    app.route('/roles/:role_id')
      .get(Roles.findOne)
      .put(Roles.update)
      .delete(Roles.delete);

    app.get('/roles/title_id', Roles.findByTitle);
  };
})();
