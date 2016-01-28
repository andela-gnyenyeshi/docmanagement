(function() {
  'use strict';
  var DocType = require('../models/doc-type');

  module.exports = {
    create: function(req, res) {
      var doc = new DocType();
      doc.type = req.body.type;
      doc.save(function(err) {
        if (err)
          return res.status(500).send(err.errormessage || err);
        return res.status(200).json({
          'message': 'Type has been successfully created'
        });
      });
    },
    find: function(req, res) {
      DocType.find(function(err, all) {
        if (err)
          return res.status(500).send(err.errormessage || err);
        return res.status(200).json(all);
      });
    },
    session: function(req, res, next) {
      if (req.session.user) {
        next();
      } else {
        return res.status(401).json({
          error: 'You are not logged in'
        });
      }
    },
    update: function(req, res) {
      DocType.findById(req.params.doc_id, function(err, doc) {
        if (err) {
          return res.status(500).send(err.errmessage || err);
        } else {
          if (req.body.type) {
            doc.type = req.body.type;
          }
          doc.save(function(err) {
            if (err) {
              return res.status(500).send(err.errmessage || err);
            } else {
              return res.status(200).json({
                'message': 'Type successfully updated'
              });
            }
          });
        }
      });
    },
    delete: function(req, res) {
      if (req.params.doc_id) {
        DocType.remove({
          _id: req.params.doc_id
        }, function(err) {
          if (err)
            return res.status(500).send(err.errmessage || err);
          return res.status(200).json({
            'message': 'Type deleted'
          });
        });
      }
    }
  };
})();
