(function() {
  'use strict';
var request = require('supertest'),
  server = supertest.agent('http://localhost:4040'),
  one = {
    firstname: 'Gertrude',
    lastname: 'Nyenyeshi',
    username: 'Sheshe',
    email: 'gertienyesh@gmail.com',
    password: 'gertrudenyenyeshi',
    role: 'Admin'
  },
  two = {
    firstname: 'Anita',
    lastname: 'Mrunde',
    username: 'Kachuna',
    email: 'anitamrunde@gmail.com',
    password: 'anitamrunde',
    role: 'Staff'
  },
  three = {
    firstname: 'Cynthia',
    lastname: 'Asingwa',
    username: 'Sepetu',
    email: 'asingwa@gmail.com',
    password: 'cynthiaasingwa'
  };

  module.exports = {
    seedUsers: function(done) {
      server
        .post('/users', one)
        .accept('application/json')
        .end();
      server
        .post('/users', two)
        .accept('application/json')
        .end();
      server
        .post('/users', three)
        .accept('application/json')
        .end();

      done();
    }
  };
})();
