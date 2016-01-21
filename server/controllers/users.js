var User = require('../models/user');
var passport = require('passport');
module.exports = {
  createUser: function(req, res, next) {
    passport.authenticate('signup', function(err, user) {
      if (err)
        return res.status(500).send(err.errmessage || err);
      if (!user) {
        res.json({
          error: 'Sign up failed. This Email or Username is already in use'
        });
      } if (user) {
        return res.json({
          message: 'User Created.'
        });
      }
    })(req, res, next);
  },
  session: function(req, res, next) {
    if (req.session.user) {
      console.log(req.session);
        next();
    } else {
      return res.status(401).json({
        error: 'You are not logged in'
      });
    }
  },
  login: function(req, res, next) {
    passport.authenticate('login', function(err, user){
      if (err)
        return res.status(500).send(err.errmessage || err);
      if (!user) {
        return res.json({
          error: 'Sorry. Wrong username and password combination'
        });
      }
      if (user) {
        req.session.user = user;
        console.log(req.session.user);
        return res.json({
          message: 'Logged in successfully'
        });
      }
    })(req, res, next);
  },
  logout: function(req, res) {
    delete req.session.user;
    console.log(req.session);
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
