(function() {
  'use strict';
  var Roles = require('../models/role');
  var roles;
  module.exports = {
    create: function(req, res) {
      Roles.findById(req.session.user.roleId, function(err, role) {
        if (err)
          return res.status(500).send(err.errmessage || err);
        roles = role.title;
        if (roles === 'Admin') {
          role.save(function(err) {
            if (err)
              return res.status(500).send(err.errmessage || err);
            return res.status(200).json({
              'message': 'Role created'
            });
          });
        } else {
          return res.status(403).json({
            'message': 'You need to be an Admin'
          });
        }
      });
    },

    createOne: function(req, res) {
      var role = new Roles();
      role.title = req.body.title;
      role.save(function(err) {
        if (err) {
          return res.status(500).send(err.errmessage || err);
        } else {
          return res.status(200).json({
            'message': 'Role created'
          });
        }
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

    find: function(req, res) {
      Roles.findById(req.session.user.roleId, function(err, role) {
        if (err)
          return res.status(500).send(err.errmessage || err);
        roles = role.title;
        if (roles === 'Admin') {
          Roles.find(function(err, roles) {
            if (err)
              return res.status(500).send(err.errmessage || err);
            return res.status(200).json(roles);
          });
        } else {
          return res.status(403).json({
            'message': 'You need to be an Admin to perfom this'
          });
        }
      });
    },

    findOne: function(req, res) {
      Roles.findById(req.session.user.roleId, function(err, role) {
        if (err)
          return res.status(500).send(err.errmessage || err);
        roles = role.title;
        if (roles === 'Admin') {
          Roles.findById(req.params.role_id, function(err, roles) {
            if (err)
              return res.status(500).send(err.errmessage || err);
            return res.status(200).json(roles);
          });
        } else {
          return res.status(403).json({
            'message': 'You need to be an Admin to perform this.'
          });
        }
      });
    },

    findByTitle: function(req, res) {
      Roles.findById(req.session.user.roleId, function(err, role) {
        if (err)
          return res.status(500).send(err.errmessage || err);
        roles = role.title;
        if (roles === 'Admin') {
          Roles.find({
            _id: req.params.title_id
          }).exec(function(err, role) {
            if (err)
              return res.status(500).send(err.errmesage || err);
            return res.status(200).json(role.title);
          });
        } else {
          return res.status(403).json({
            'message': 'You must be an Admin to perform this function'
          });
        }
      });
    },

    update: function(req, res) {
      Roles.findById(req.session.user.roleId, function(err, role) {
        if (err)
          return res.status(500).send(err.errmessage || err);
        roles = role.title;
        if (roles === 'Admin') {
          Roles.findById(req.params.role_id, function(err, role) {
            if (err) {
              return res.status(500).sned(err.errmessage || err);
            } else {
              if (req.body.title) {
                role.title = req.body.title;
              }
              role.save(function(err) {
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
            if (req.params.role_id) {
              Roles.remove({
                _id: req.params.role_id
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
