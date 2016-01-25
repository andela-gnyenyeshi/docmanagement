var docTypes = require('../controllers/doc-type');

module.exports = function(app) {
  app.post('/types', docTypes.create);
  app.get('/types', docTypes.find);
};
