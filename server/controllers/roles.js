var Roles = require('../models/role');

module.exports = {
  create: function(req, res) {
    var role = new Role();
    role.title = req.body.title;
    role.save(function(err) {
      if (err) {
        return res.status(500).send(err.errmessage || err);
      } else {
        res.json({'message': 'Role successfully created'});
      }
    });
  },

  find: function(req, res) {
    Roles.find(function(err, roles) {
      if (err) {
        return res.status(500).send(err.errmessage || err);
      } else {
        res.json(roles);
      }
    });
  },

  findOne: function(req, res) {
    Roles.findById(req.params.role_id, function(err, role){
      if (err) {
        res.status(500).send(err.errmessage || err);
      } else {
        res.json(role);
      }
    });
  },

  update: function(req, res) {
    Roles.findById(req.params.role_id, function(err, role){
      if (err) {
        res.status(500).send(err.errmessage || err);
      } else {
        if (req.body.title) {
          role.title = req.body.title;
        }
        role.save(function(err) {
          if (err) {
            return res.status(500).send(err.errmessage || err);
          } else {
            res.json({'message': 'Role successfully updated'});
          }
        });
      }
    });
  },

  delete: function(req, res) {
    if (req.params.role_id) {
      Roles.remove({_id: req.params.role_id}, function(err){
        if (err) {
          return res.status(500).send(err.errmessage || err);
        } else {
          res.json({'message': 'Role deleted'});
        }

      });
    }
  }
};
