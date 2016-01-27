var docTypes = require('../controllers/doc-type');

module.exports = function(app) {
  app.use(docTypes.session);
  app.route('/types')
    .post(docTypes.create)
    .get(docTypes.find);
  app.route('/types/:doc_id')
    .put(docTypes.update)
    .delete(docTypes.delete);
};
