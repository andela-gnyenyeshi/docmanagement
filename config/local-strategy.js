var passport = require('passport'),
  User = require('../server/models/user'),
  bcrypt = require('bcrypt-nodejs'),
  Users = require('../server/controllers/users'),
  Roles = require('../server/models/role'),
  LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'username',
    passReqToCallback: true
  }, function createUser(req, email, username, done) {
    process.nextTick(function() {
      // Checking if email is in use
      User.findOne({
        $or: [{
          'email': email
        }, {
          'username': username
        }]
      }, function(err, user) {
        if (err) {
          console.log('Err ya kusign up');
          return done(err);
        }
        if (user) {
          console.log('Someone already has this Username or Email. Sorry -_-');
          return done(null, false);
        } else {
          // Create user if email is not in use
          // var roles;
          // if (!req.body.roles) {
          //   roles = Roles.find({
          //     title: 'Viewer'
          //   }).exec(function(err, role) {
          //     if (err)
          //       console.log(err);
          //     console.log(role);
          //   });
          // }
          //console.log(roles);
          var newUser = new User();
          newUser.name.first = req.body.name.first;
          newUser.name.last = req.body.name.last;
          newUser.username = req.body.username;
          newUser.email = req.body.email;
          //newUser.role = roles;
          newUser.password = newUser.generateHash(req.body.password);

          // Save the user
          newUser.save(function(err) {
            if (err)
              throw err;
            console.log('created');
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.use('login', new LocalStrategy({
    passReqToCallback: true
  }, function(req, username, password, done) {
    User.findOne({
      'username': username
    }, function(err, user) {
      if (err) {
        // In case of any error
        return done(err);
      }
      if (!user) {
        // If user with that username is not found
        console.log('User not found with username ' + username);
        return done(null, false);
      }
      // If user exists but wrong password
      if (!validPassword(user, password)) {
        console.log('Invalid Password');
        return done(null, false);
      }
      // Success
      return done(null, user);
    });
  }));

  var validPassword = function(user, password) {
    return bcrypt.compareSync(password, user.password);
  };

  // var createUser = function(req, res) {
  //
  // };
};
