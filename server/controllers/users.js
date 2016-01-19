var User = require('../models/user');
var passport = require('passport');
module.exports = {
  createUser: function(req, res) {},
  logout: function(req, res) {
    req.logout();
    res.redirect('/logout');
  },

  find: function(req, res) {
    User.find(function(err, users) {
      if (err) {
        return res.status(500).send(err.errmessage || err);
      } else {
        return res.json(users);
      }
    });
  },

  findOne: function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err) {
        return res.status(500).send(err.errmessage || err);
      } else {
        return res.json(user);
      }
    });
  },

  update: function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err) {
        return res.status(500).send(err.errmessage || err);
      } else {
        if (req.body.name.first) {
          user.firstname = req.body.name.first;
        }
        if (req.body.name.last) {
          user.lastname = req.body.name.last;
        }
        if (req.body.username) {
          user.username = req.body.username;
        }
        if (req.body.email) {
          user.email = req.body.email;
        }
        if (req.body.password) {
          user.password = req.body.password;
        }
        user.save(function(err) {
          if (err) {
            return res.status(500).send(err.errmessage || err);
          } else {
            return res.json({
              'message': 'User successfully updated!'
            });
          }
        });
      }
    });
  },

  delete: function(req, res) {
    if (req.params.user_id) {
      User.remove({
        _id: req.params.user_id
      }, function(err) {
        if (err) {
          return res.status(500).send(err.errmessage || err);
        } else {
          return res.json({
            'message': 'User deleted successfully!'
          });
        }
      });
    }
  },

  success: function(req, res) {
    res.json({'message': 'Logged in Successfully'});
  },

  loginFail: function(req, res) {
    res.json({'message': 'Failed to Login'});
  },

  signupFail: function(req, res) {
    res.json({'message': 'Failed to Sign up'});
  },

  loggedOut: function(req, res) {
    res.json({'message': 'Logged out successfully'});
  }
};
