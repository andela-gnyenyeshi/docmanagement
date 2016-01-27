var Documents = require('../controllers/documents.js');

module.exports = function(app) {
  app.use(Documents.session);
  app.post('/documents', Documents.create);
  app.get('/documents', Documents.find);
  app.get('/documents/one', Documents.findByUser);
  app.get('/documents/:access_id', Documents.findByRole);
  app.delete('/documents/:document_id', Documents.delete);
  app.put('/documents/:document_id', Documents.update);
};
