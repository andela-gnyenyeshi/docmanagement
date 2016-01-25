var docType = require('../models/doc-type');

module.exports = {
  create: function(req, res) {
    var doc = new docType();
    doc.type = req.body.type;
    doc.save(function(err, type) {
      if (err)
       return res.status(500).send(err.errormessage || err);
      return res.json({'message': 'Type has been successfully created'});
    });
  },
  find: function(req, res) {
    docType.find(function(err, all) {
      if (err)
       return res.status(500).send(err.errormessage || err);
      return res.json(all);
    });
  }
};
