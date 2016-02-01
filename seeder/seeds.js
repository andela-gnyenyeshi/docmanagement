(function() {
  'use strict';
  var config = require('../config/config'),
    Users = require('../server/models/user'),
    Roles = require('../server/models/role'),
    supertest = require('supertest'),
    server = supertest.agent('http://localhost:4040'),
    async = require('async'),
    Types = require('../server/models/doc-type'),
    Documents = require('../server/models/document'),
    app = require('../app.js');


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
    var one, two, three;
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
            role: roles[1].title
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
            role: roles[0].title
          })
          .expect("Content-type", /json/)
          .end(function(err, res) {
            //console.log('haha',res.body);
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
            role: roles[2].title
          })
          .expect("Content-type", /json/)
          .end(function(err, res) {
            //console.log('ha',res.body);
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
    var created = [];
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
      content: 'Clark Kent',
      ownerId: user.one._id,
      accessType: 'Private',
      typeId: type[0]._id,
      lastModified: Date.now(),
      dateCreated: Date.now(),
      accessId: role[0]._id
    }, {
      title: 'Three',
      content: 'Winker Watson',
      ownerId: user.one._id,
      accessType: 'None',
      typeId: type[0]._id,
      lastModified: Date.now(),
      dateCreated: Date.now(),
      accessId: role[1]._id
    }, {
      title: 'Four',
      content: 'Magnus Bane',
      ownerId: user.two._id,
      accessType: 'None',
      typeId: type[0]._id,
      lastModified: Date.now(),
      dateCreated: Date.now(),
      accessId: role[1]._id
    }, {
      title: 'Five',
      content: 'Christian Bale',
      ownerId: user.two._id,
      accessType: 'Private',
      typeId: type[1]._id,
      lastModified: Date.now(),
      dateCreated: Date.now(),
      accessId: role[1]._id
    }, {
      title: 'Six',
      content: 'Dennis the Menace',
      ownerId: user.two._id,
      accessType: 'None',
      typeId: type[2]._id,
      lastModified: Date.now(),
      dateCreated: Date.now(),
      accessId: role[2]._id
    }, {
      title: 'Seven',
      content: 'Gandalf the White',
      ownerId: user.three._id,
      accessType: 'Private',
      typeId: type[2]._id,
      lastModified: Date.now(),
      dateCreated: Date.now(),
      accessId: role[2]._id
    }, {
      title: 'Eight',
      content: '221B Baker Street',
      ownerId: user.three._id,
      accessType: 'None',
      typeId: type[2]._id,
      lastModified: Date.now(),
      dateCreated: Date.now(),
      accessId: role[2]._id
    }, {
      title: 'Nine',
      content: 'Gniper and Gnasher',
      ownerId: user.three._id,
      accessType: 'None',
      typeId: type[3]._id,
      lastModified: Date.now(),
      dateCreated: Date.now(),
      accessId: role[0]._id
    }];

    async.series([
      function(callback) {
        Documents.create(documents[0], function(err, docs) {
          created.push(docs);
          callback(err, docs);
        });
      },
      function(callback) {
        Documents.create(documents[1], function(err, docs) {
          var date = new Date(docs.dateCreated);
          date.setDate(date.getDate() + 1);
          docs.dateCreated = date;
          docs.save(callback(err, docs));
          created.push(docs);
        });
      },
      function(callback) {
        Documents.create(documents[2], function(err, docs) {
          var date = new Date(docs.dateCreated);
          date.setDate(date.getDate() + 2);
          docs.dateCreated = date;
          docs.save(callback(err, docs));
          created.push(docs);
        });
      },
      function(callback) {
        Documents.create(documents[3], function(err, docs) {
          var date = new Date(docs.dateCreated);
          date.setDate(date.getDate() + 3);
          docs.dateCreated = date;
          docs.save(callback(err, docs));
          created.push(docs);
        });
      },
      function(callback) {
        Documents.create(documents[4], function(err, docs) {
          var date = new Date(docs.dateCreated);
          date.setDate(date.getDate() + 4);
          docs.dateCreated = date;
          docs.save(callback(err, docs));
          created.push(docs);
        });
      },
      function(callback) {
        Documents.create(documents[5], function(err, docs) {
          var date = new Date(docs.dateCreated);
          date.setDate(date.getDate() + 5);
          docs.dateCreated = date;
          docs.save(callback(err, docs));
          created.push(docs);
        });
      },
      function(callback) {
        Documents.create(documents[6], function(err, docs) {
          var date = new Date(docs.dateCreated);
          date.setDate(date.getDate() + 6);
          docs.dateCreated = date;
          docs.save(callback(err, docs));
          created.push(docs);
        });
      },
      function(callback) {
        Documents.create(documents[7], function(err, docs) {
          var date = new Date(docs.dateCreated);
          date.setDate(date.getDate() + 7);
          docs.dateCreated = date;
          docs.save(callback(err, docs));
          created.push(docs);
        });
      },
      function(callback) {
        Documents.create(documents[8], function(err, docs) {
          var date = new Date(docs.dateCreated);
          date.setDate(date.getDate() + 8);
          docs.dateCreated = date;
          docs.save(callback(err, docs));
          created.push(docs);
        });
      }
    ], next(created));
  }

  function cleardb(done) {
    async.waterfall([
      function(callback) {
        Documents.remove({}, function() {
          console.log('Document collection cleared');
          callback(null);
        });
      },

      function(callback) {
        Roles.remove({}, function() {
          console.log('Role collection cleared');
          callback(null);
        });
      },

      function(callback) {
        Types.remove({}, function() {
          console.log('Type collection cleared');
          callback(null);
        });
      },

      function(callback) {
        Users.remove({}, function() {
          console.log('Roles collection cleared');
          callback(null);
        });
      }
    ], function() {
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
          console.log('Seeding Types');
          typeSeed(function(err, types) {
            callback(null, types, rs);
          });
        },
        function(rs, types, callback) {
          console.log('Seeding Roles');
          roleSeed(function(err, roles) {
            callback(null, types, rs, roles);
          });
        },
        function(rs, types, roles, callback) {
          console.log('Seeding Users');
          userSeed(roles, function(users) {
            callback(null, types, rs, roles, users);
          });
        },

        function(types, rs, roles, users, callback) {
          documentSeed(users, roles, types, function(err, documents) {
            console.log('Seeding Documents');
            console.log(documents);
            callback(null, documents, types, roles, users, rs);
          });
        }
      ], function(err, documents, types, roles, users, rs) {
        done({
          types: types,
          roles: roles,
          users: users,
          message: rs,
          documents: documents
        });
      });
    }
  };
})();
