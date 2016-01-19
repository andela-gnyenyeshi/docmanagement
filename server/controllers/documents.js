var Document = require('../models/document');

module.exports = {
  create: function(req, res) {
    var document = new Document();
    document.title = req, body.title;
    document.content = req.body.content;
  }
};
