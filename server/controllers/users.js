(function() {
  'use strict';
var User = require('../models/user');
var Roles = require('../models/role');
var passport = require('passport');
var roles;

module.exports = {
  createUser: function(req, res, next) {
    passport.authenticate('signup', function(err, user) {
      if (err)
        return res.status(500).send(err.errmessage || err);
      if (!user) {
        return res.status(449).json({
          error: 'Sign up failed. This Email or Username is already in use'
        });
      }
      if (user) {
        return res.status(200).json({
          message: 'User Created.'
        });
      }
    })(req, res, next);
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

  login: function(req, res, next) {
    passport.authenticate('login', function(err, user) {
      if (err)
        return res.status(500).send(err.errmessage || err);
      if (!user) {
        return res.status(449).json({
          error: 'Sorry. Wrong username and password combination'
        });
      }
      if (user) {
        req.session.user = user;
        return res.status(200).json({
          message: 'Logged in successfully'
        });
      }
    })(req, res, next);
  },

  logout: function(req, res) {
    delete req.session.user;
    res.redirect('/logout');
  },

  find: function(req, res) {
    User.find(function(err, users) {
      if (err) {
        return res.status(500).send(err.errmessage || err);
      } else {
        return res.status(200).json(users);
      }
    });
  },

  findOne: function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err) {
        return res.status(500).send(err.errmessage || err);
      } else {
        return res.status(200).json(user);
      }
    });
  },

  update: function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (req.session.user._id === user._id) {
        if (err) {
          return res.status(500).send(err.errmessage || err);
        } else {
          if (req.body.firstname) {
            user.name.first = req.body.firstname;
          }
          if (req.body.lastname) {
            user.name.last = req.body.lastname;
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
              return res.status(200).json({
                'message': 'User successfully updated!'
              });
            }
          });
        }
      } else {
        return res.status(403).json({
          'message': 'Sorry. Only the Owner can update the profile'
        });
      }
    });
  },

  delete: function(req, res) {
    Roles.findById(req.session.user.roleId, function(err, role) {
      if (err)
        return res.status(500).send(err.errmessage || err);
      roles = role.title;
      if (roles === 'Admin') {
        if (req.params.user_id) {
          User.remove({
            _id : req.params.user_id
          }, function(err){
            if (err)
              return res.status(500).send(err.errmessage || err);
            return res.status(200).json({
              'message': 'User deleted successfully'
            });
          });
        }
      } else {
        return res.status(403).json({
          'message': 'You need to be an Admin to perfomr this action'
        });
      }
    });
  },

  loggedOut: function(req, res) {
    return res.status(200).json({
      'message': 'You have logged out successfully'
    });
  }
};
})();
