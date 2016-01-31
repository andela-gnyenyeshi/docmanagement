(function() {
  'use strict';
  var DocType = require('../models/doc-type');
  var Roles = require('../models/role');
  var roles;

  module.exports = {
    create: function(req, res) {
      // Check User role to see if it is Admin
      Roles.findById(req.session.user.roleId, function(err, role) {
        if (err)
          return res.status(500).send(err.errmessage || err);
        roles = role.title;
        if (roles === 'Admin') {
          var doc = new DocType();
          doc.type = req.body.type;
          doc.save(function(err) {
            if (err)
              return res.status(500).send(err.errmessage || err);
            return res.status(200).json({
              'message': 'Type created'
            });
          });
        } else {
          return res.status(403).json({
            'message': 'You need to be an Admin'
          });
        }
      });
    },
    find: function(req, res) {
      Roles.findById(req.session.user.roleId, function(err, role) {
        if (err)
          return res.status(500).send(err.errmessage || err);
        roles = role.title;
        if (roles === 'Admin') {
          DocType.find(function(err, roles) {
            if (err)
              return res.status(500).send(err.errmessage || err);
            return res.status(200).json(roles);
          });
        } else {
          return res.status(403).json({
            'message': 'You need to be an Admin to perform this'
          });
        }
      });
    },
    // Function to allow authenticated Users the respective rights.
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
      Roles.findById(req.session.user.roleId, function(err, role) {
        if (err)
          return res.status(500).send(err.errmessage || err);
        roles = role.title;
        if (roles === 'Admin') {
          DocType.findById(req.params.doc_id, function(err, doc) {
            if (err) {
              return res.status(500).sned(err.errmessage || err);
            } else {
              if (req.body.type) {
                doc.type = req.body.type;
              }
              doc.save(function(err) {
                if (err) {
                  return res.status(500).send(err.errmessage || err);
                } else {
                  return res.status(200).json({
                    'message': 'Role successfully updated'
                  });
                }
              });
            }
          });
        } else {
          return res.status(403).json({
            'message': 'You must be an Admin to perform this action'
          });
        }
      });
    },
    delete: function(req, res) {
      Roles.findById(req.session.user.roleId, function(err, roles) {
        if (err) {
          return res.status(500).send(err.errmessage || err);
        } else {
          roles = roles.title;
          if (roles === 'Admin') {
            if (req.params.doc_id) {
              Roles.remove({
                _id: req.params.doc_id
              }, function(err) {
                if (err)
                  return res.status(500).send(err.errmessage || err);
                return res.status(200).json({
                  'message': 'Role deleted'
                });
              });
            }
          } else {
            return res.status(403).json({
              'message': 'You must be an Admin to perform this action'
            });
          }
        }
      });
    }
  };
})();
