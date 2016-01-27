var supertest = require('supertest');
var should = require('should');
var app = require('../document-manager.js');
var User = require('./server/models/user');
var server = supertest.agent('http://localhost:4040');
var user;

describe('sample test', function(){
  it ('Should return home page', function(done) {
    server
     .get('/users')
     .expect('Content-type', /json/)
     .expect(200)
     .end(function(err, res) {
       if (err)
        throw err;
       done();
     });
  });
});

describe('Unique user', function(done) {
  beforeEach(function(done){
    user = new User({
      
    });
  });
});
