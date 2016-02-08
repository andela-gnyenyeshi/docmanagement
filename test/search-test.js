(function() {
  var supertest = require('supertest');
  var app = require('../app.js');
  var expect = require('chai').expect;
  var should = require('should');
  var assert = require('assert');
  jwt = require('jsonwebtoken');
  server = supertest.agent('http://127.0.0.1:4040');
  var helper = require('../seeder/seeds');

  describe('Document Management System', function() {
      var user, documents, token;
      describe('Search functions', function() {
        it('Documents can be searched by date', function(done) {
          server
            .post('/api/users/login')
            .send({
              username: 'Kidoti',
              password: 'cynthiaasingwa'
            })
            .end(function(err, res) {
              user = res.body;
              token = res.body.token;
              server
                .get('/api/documents/' + '?from=2016-01-30&to=2016-02-11')
                .set('x-access-token', token)
                .end(function(err, res) {
                  assert.strictEqual(res.body.length, 2);
                  assert.strictEqual(res.status, 200);
                  expect(res.body).to.have.length(2);
                  done();
                });
            });
        });
        it('Documents can be searched by title', function(done) {
          server
            .get('/api/documents/?title=Six')
            .set('x-access-token', token)
            .end(function(err, res) {
              assert.strictEqual(res.status, 200);
              assert.strictEqual(res.body[0].title, 'Six');
              done();
            });
        });
        it('User can only search documents available to him/her', function(done) {
          server
            .get('/api/documents/?title=Two')
            .set('x-access-token', token)
            .end(function(err, res) {
              assert.strictEqual(res.status, 404);
              assert.strictEqual(res.body.message, 'No documents found');
              done();
            });
        });
      });
  });
  })();
