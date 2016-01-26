var Document = require('../models/document'),
  Role = require('../models/role'),
  passport = require('passport'),
  Type = require('../models/doc-type');
  var id;

function roleType(param) {
  Role.findById(param, function(err, role) {
    if (err)
      return res.status(500).send(err.errmessage || err);
    console.log(role.title);
    return role.title;
  });
}

function findId (param) {
  Role.find ({
    title: param
  }, function(err, role) {
    if (err) {
      return res.status(500).send(err.errmessage || err);
    } else {
      console.log(role);
      return role._id;
    }
  });
}

module.exports = {
  create: function(req, res, next) {
    if (req.session.user) {
      var document = new Document();
      document.ownerId = req.session.user._id;
      document.title = req.body.title;
      document.content = req.body.content;
      document.dateCreated = Date.now();
      document.accessType = req.body.accessType || "None";
      document.lastModified = Date.now();
    }

    Role.find({
      title: req.body.access || 'Viewer'
    }).exec(function(err, access) {
      if (err) {
        res.status(500).send(err.errormessage || err);
      } else {
        document.accessId = access[0]._id;
        console.log('ROLE', document);

        Type.find({
          type: req.body.type || 'General'
        }).exec(function(err, type) {
          if (err)
            return res.status(500).send(err.errormessage || err);
          document.typeId = type[0]._id;
          console.log('TYPE', document);

          document.save(function(err, doc) {
            console.log('SAVE', document);
            console.log(document.ownerId);
            if (err)
              return res.status(500).send(err.errormessage || err);
            res.json(document);
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
    }).limit(5).sort({
      dateCreated: -1
    }).exec(function(err, document){
      if (err) {
        return res.status(500).send(err.errmessage || err);
      } else {
        return res.json(document);
      }
    });
  },

  findByDate : function() {

  },

  findByUser: function (req, res) {
    Document.find({
      ownerId: req.session.user._id
    }).sort({
      dateCreated: -1
    }).exec(function(err, docs) {
      if (err) {
        return res.status(500).send(err.errmessage || err);
      } else {
        return res.json(docs);
      }
    });
  },

  findByRole : function(req, res) {
    Document.find({
      accessId: req.params.role_id,
      accessType: 'None'
  }, function (err, doc) {
    if (err) {
      return res.status(500).send(err.errmessage || err);
    } else {
      return res.json(doc);
    }
  });
  },

  delete: function(req, res) {
    Document.findById(req.params.document_id, function(err, doc) {
      if (err) {
        return res.status(500).send(err.message || err);
      } else {
        // Documents can only be deleted by Admin or Owner
        if (req.session.user._id === doc.ownerId || roleType(req.session.user.roleId) === 'Admin') {
          Document.remove({
            _id: req.params.document_id
          }, function(err, docs) {
            if (err)
              res.status(500).send(err.errmessage || err);
            return res.json({
              'message': 'Has been successfully deleted'
            });
          });
        } else {
          return res.json({
            'message': 'Sorry. You must be Owner or Admin to delete this document'
          });
        }
      }
    });
  },

  update: function(req, res) {
    Document.findById(req.params.document_id, function(err, doc) {
      if (err) {
        return res.status(500).send(err.errmessage || err);
      } else {
        // Users can only edit documents availabel to their role or they are the owner
        if (doc.accessId == req.session.user.roleId || doc.ownerId === req.session.user_id) {
          console.log('Girls');
          if (req.body.title) {
            console.log('Hehe');
            doc.title = req.body.title;
          }
          if (req.body.content) {
            doc.content = req.body.content;
          }
          doc.save(function(err) {
            if (err) {
              return res.status(500).send(err.errmessage || err);
            } else {
              return res.json({
                'message': 'Document successfully updated'
              });
            }
          });
        }
      }
    });
  }
};
