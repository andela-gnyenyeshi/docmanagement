var Roles = require('../controllers/roles');

module.exports = function(app) {
  app.post('/roles', Roles.create);
  app.get('/roles', Roles.find);
  app.get('/roles/find', Roles.findByTitle);
  app.get('/roles/:role_id', Roles.findOne);
  app.put('/roles/:role_id', Roles.update);
  app.delete('/roles/:role_id', Roles.delete);

};
