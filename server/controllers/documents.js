(function() {
  'use strict';
  var Document = require('../models/document'),
    Role = require('../models/role'),
    Type = require('../models/doc-type');
  var roles;

  module.exports = {
    create: function(req, res) {
      if (req.session.user) {
        var document = new Document();
        document.ownerId = req.session.user._id;
        document.title = req.body.title;
        document.content = req.body.content;
        document.dateCreated = Date.now();
        document.accessType = req.body.accessType || "None";
        document.lastModified = Date.now();
      }
      // Get RoleId of the role assigned to the document
      Role.find({
        title: req.body.access || 'Viewer'
      }).exec(function(err, access) {
        if (err) {
          res.status(500).send(err.errormessage || err);
        } else {
          document.accessId = access[0]._id;

          // Get TypeId of the role assigned to the document
          Type.find({
            type: req.body.type || 'General'
          }).exec(function(err, type) {
            if (err)
              return res.status(500).send(err.errormessage || err);
            document.typeId = type[0]._id;
            document.save(function(err, document) {
              if (err)
                return res.status(500).send(err.errormessage || err);
              return res.status(200).json(document);
            });
          });
        }
      });
    },

    session: function(req, res, next) {
      // Check if User is logged in and in session object
      if (req.session.user) {
        next();
      } else {
        return res.status(401).json({
          error: 'You are not logged in'
        });
      }
    },

    find: function(req, res) {
      // Users can only view documents available to their roles and are not private.
      Document.find({
        accessType: 'None',
        accessId: req.session.user.roleId
      }).limit(req.query.limit).sort({
        dateCreated: -1
      }).exec(function(err, document) {
        if (err) {
          return res.status(500).send(err.errmessage || err);
        } else {
          return res.status(200).json(document);
        }
      });
    },

    findByUser: function(req, res) {
      Document.find({
        ownerId: req.session.user._id
      }).sort({
        dateCreated: -1
      }).exec(function(err, docs) {
        if (err) {
          return res.status(500).send(err.errmessage || err);
        } else if (docs && docs.length) {
          return res.status(200).json(docs);
        } else {
          return res.status(404).json({
            'message': 'No documents found'
          });
        }
      });
    },

    findByRole: function(req, res) {
      Document.find({
        accessId: req.params.access_id,
        accessType: 'None'
      }, function(err, doc) {
        if (err) {
          return res.status(500).send(err.errmessage || err);
        } else if (doc && doc.length) {
          return res.status(200).json(doc);
        } else {
          return res.status(404).json({
            'message': 'No documents found'
          });
        }
      });
    },

    findByDate: function(req, res) {
      Document.find({
        accessType: 'None',
        accessId: req.session.user.roleId,
        dateCreated: {
          $gte: new Date(req.query.from),
          $lt: new Date(req.query.to) || new Date()
        }
      }, function(err, documents) {
        if (err) {
          return res.status(500).send(err.errmessage || err);
        } else if (documents.length < 1) {
          res.status(404).json({
            'message': 'No documents found'
          });
        } else {
          res.status(200).json(documents);
        }
      });
    },

    delete: function(req, res) {
      Document.findById(req.params.document_id, function(err, doc) {
        if (err) {
          return res.status(500).send(err.message || err);
        } else {
          // Documents can only be deleted by Admin or Owner
          Role.findById(req.session.user.roleId, function(err, role) {
            if (err)
              return res.status(500).send(err.errmessage || err);
            roles = role.title;
            if (roles === 'Admin' || doc.ownerId === req.session.user._id) {
              Document.remove({
                _id: req.params.document_id
              }, function(err) {
                if (err)
                  return res.status(500).send(err.errmessage || err);
                return res.status(200).json({
                  'message': 'Document has been deleted'
                });
              });
            } else {
              return res.status(403).json({
                'message': 'You need to be Owner or Admin to delete this Document'
              });
            }
          });
        }
      });
    },

    update: function(req, res) {
      Document.findById(req.params.document_id, function(err, doc) {
        if (err) {
          return res.status(500).send(err.errmessage || err);
        } else {
          // Users can only edit documents available to their role or they are the owner
          if (doc.accessId == req.session.user.roleId || doc.ownerId === req.session.user_id) {
            if (req.body.title) {
              doc.title = req.body.title;
            }
            if (req.body.content) {
              doc.content = req.body.content;
            }
            doc.save(function(err) {
              if (err) {
                return res.status(500).send(err.errmessage || err);
              } else {
                return res.status(200).json(doc);
              }
            });
          }
        }
      });
    }
  };
})();
