(function() {
  var config = require('../config/config'),
    Users = require('../server/models/user'),
    Roles = require('../server/models/role'),
    supertest = require('supertest'),
    server = supertest.agent('http://localhost:4040'),
    async = require('async'),
    Types = require('../server/models/doc-type'),
    Documents = require('../server/models/document'),
    app = require('../document-manager.js'),
    url = config.db;

  function roleSeed(next) {
    var roles = [{
      title: 'Viewer'
    }, {
      title: 'Admin'
    }, {
      title: 'Staff'
    }];
    Roles.create(roles, function(err, role) {
      next(err, role);
    });
  }

  function typeSeed(next) {
    //console.log('seeding types');
    var types = [{
      type: 'General'
    }, {
      type: 'Business'
    }, {
      type: 'Education'
    }, {
      type: 'Personal'
    }];

    Types.create(types, function(err, type) {
      next(err, type);
    });
  }

  function userSeed(roles, done) {
    var one, two , three;
    async.waterfall([
      function(callback) {
        server
          .post('/users')
          .send({
            username: 'Sheshe',
            firstname: 'Gertrude',
            lastname: 'Nyenyeshi',
            email: 'gertienyesh@gmail.com',
            password: 'gertrudenyenyeshi',
            roleId: roles[1]._id
          })
          .expect("Content-type", /json/)
          .end(function(err, res) {
            //console.log('kok',res.body);
            one = res.body;
            callback(null, one);
          });
      },

      function(one, callback) {
        server
          .post('/users')
          .send({
            username: 'Kachuna',
            firstname: 'Anita',
            lastname: 'Mrunde',
            email: 'anita@gmail.com',
            password: 'anitamrunde',
            roleId: roles[0]._id
          })
          .expect("Content-type", /json/)
          .end(function(err, res) {
          //  console.log('haha',res.body);
            two = res.body;
            callback(null, two, one);
          });
      },
      function(one, two, callback) {
        server
          .post('/users')
          .send({
            username: 'Kidoti',
            firstname: 'Cynthia',
            lastname: 'Asingwa',
            email: 'asingwa@gmail.com',
            password: 'cynthiaasingwa',
            roleId: roles[2]._id
          })
          .expect("Content-type", /json/)
          .end(function(err, res) {
          //  console.log('ha',res.body);
            three = res.body;
            callback(null, one, two, three);
          });
      }
    ], function(err, one, two, three) {
      done({
        one: one,
        two: two,
        three: three
      });
    });
  }

  function documentSeed(user, role, type, next) {
    //console.log('ROLE', role, 'USER', user, 'TYPE', type);
    var documents = [{
      title: 'One',
      content: 'Tony Stark',
      ownerId: user.one._id,
      accessType: 'None',
      typeId: type[0]._id,
      lastModified: Date.now(),
      dateCreated: Date.now(),
      accessId: role[0]._id
    }, {
      title: 'Two',
      content: 'Christian Bale',
      ownerId: user.two._id,
      accessType: 'Private',
      typeId: type[1]._id,
      lastModified: Date.now(),
      dateCreated: Date.now(),
      accessId: role[1]._id
    }, {
      title: 'Three',
      content: '221B Baker Street',
      ownerId: user.three._id,
      accessType: 'None',
      typeId: type[2]._id,
      lastModified: Date.now(),
      dateCreated: Date.now(),
      accessId: role[2]._id
    }];

    Documents.create(documents, function(err, docs) {
      next(err, docs);
    });
  }

  function cleardb(done) {
    async.waterfall([
      function(callback) {
        Documents.remove({}, function(err, results) {
          console.log('Document collection cleared');
          callback(null);
        });
      },

      function(callback) {
        Roles.remove({}, function(err, results) {
          console.log('Role collection cleared');
          callback(null);
        });
      },

      function(callback) {
        Types.remove({}, function(err, results) {
          console.log('Type collection cleared');
          callback(null);
        });
      },

      function(callback) {
        Users.remove({}, function(err, results) {
          console.log('Roles collection cleared');
          callback(null);
        });
      }
    ], function(err) {
      done('Finished');
    });
  }

  module.exports = {
    starter: function(done) {
      async.waterfall([
        function(callback) {
          cleardb(function(rs) {
            callback(null, rs);
          });
        },
        function(rs, callback) {
          console.log('Sasa ni types hapo');
          typeSeed(function(err, types) {
            //console.log('Seeded types', types);
            callback(null, types, rs);
          });
        },
        function(rs, types, callback) {
          console.log('tuko kwa roles mboss');
          roleSeed(function(err, roles) {
            //console.log('Seeded roles', roles);
            callback(null, types, rs, roles);
          });
        },
        function(rs, types, roles, callback) {
          console.log('Users sasa ndio mambo');
          userSeed(roles, function(users) {
            callback(null, types, rs, roles, users);
          });
        },

        function(types, rs, roles, users, callback) {
          //console.log('ROLES', roles, 'TYPES', types);
          documentSeed(users, roles, types, function(err, documents) {
            // console.log('Huyu ndio user', users[0]);
            // if (err) {
            //   throw err;
            // }
            // else {
            //   console.log('docs', documents);
            //   server
            //     .post('/users/login')
            //     .send({
            //       username: 'Sheshe',
            //       password: 'gertrudenyenyeshi'
            //     })
            //     .end(function() {
            //     });
            // }
            callback(null, documents, types, roles, users, rs);
          });
        }
      ], function(err, documents, types, roles, users, rs) {
        done({
          types: types,
          rs: rs,
          roles: roles,
          users: users,
          documents: documents
        });
      });
    },
  };
})();
