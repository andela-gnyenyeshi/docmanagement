// process.nextTick(function() {
  // Checking if email is in use
  // User.findOne({ $or: [{'email': email}, {'username': username}]}, function(err, user) {
  //   console.log(user);
  //   if (err) {
  //     console.error('Err ya kusign up');
  //     return done(err);
  //   }
  //   if (user) {
  //     //res.statusCode();
  //     console.log('Someone already has this Username or Email. Sorry -_-');
  //     return done(null, false);
  //   }
  //   else {
  //     // Create user if email is not in use
  //     var newUser = new User();
  //     newUser.name.first = req.body.name.first;
  //     newUser.name.last = req.body.name.last;
  //     newUser.username = req.body.username;
  //     newUser.email = req.body.email;
  //     // newUser.role = role;
  //     newUser.password = newUser.generateHash(req.body.password);
  //
  //     // Save the user
  //     newUser.save(function(err) {
  //       if (err) {
  //         if (err.name == 'ValidationError') {
  //           for (field in err.errors) {
  //             console.log(err.errors[field].message);
  //           }
  //           throw err;
  //         }
  //       }
  //       console.log('created');
  //       console.log(newUser);
  //       return done(null, newUser);
  //     });
  //   }
  // });
  passport.use('signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'username',
  passReqToCallback: true
}, function(req, email, username, done){
  process.nextTick(function() {
    // Checking if email is in use
    User.findOne({$or: [{'email': email}, {'username': username}]}, function(err, user) {
      if (err) {
        console.log('Err ya kusign up');
        return done(err);
      }
      if (user) {
        console.log('Someone already has this Username or Email. Sorry -_-');
        return done(null, false);
      } else {
        // Create user if email is not in use
        var newUser = new User();
        newUser.name.first = req.body.name.first;
    		newUser.name.last = req.body.name.last;
    		newUser.username = req.body.username;
    		newUser.email = req.body.email;
    		newUser.password = newUser.generateHash(req.body.password);

        // Save the user
        newUser.save(function(err) {
    			if (err) throw err;
            console.log('created');
            return done(null, newUser);
    		});
      }
    });
  });
}));
