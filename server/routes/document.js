var Documents = require('../controllers/documents.js');

module.exports = function(app) {
  app.post('/documents', Documents.session, Documents.create);
  app.get('/documents', Documents.find);
};
