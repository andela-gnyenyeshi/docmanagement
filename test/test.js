var supertest = require('supertest');
var should = require('should');

var server = supertest.agent('http://localhost:4040');

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
