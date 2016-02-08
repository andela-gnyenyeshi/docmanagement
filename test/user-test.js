(function() {
  'use strict';
  var supertest = require('supertest');
  var expect = require('chai').expect;
  var assert = require('assert');
  var server = supertest.agent('http://127.0.0.1:4040');

  describe('User tests', function() {
    var user, admin, token, token1;
    describe('User', function() {
      it('A new user can be created', function(done) {
        server
          .post('/api/users')
          .send({
            firstname: 'Sherlock',
            lastname: 'Holmes',
            username: 'Watson',
            email: 'bakerstreet@gmail.com',
            password: 'gertrudenyenyeshi'
          })
          .end(function(err, res) {
            user = res.body;
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.name.first, 'Sherlock');
            expect(res.body.name.first).to.have.string('Sherlock');
            expect(res.body.name.first).to.be.a('string');
            done();
          });
      });

      it('The new user must be unique', function(done) {
        server
          .post('/api/users')
          .send({
            firstname: 'Sherlock',
            lastname: 'Holmes',
            username: 'Watson',
            email: 'bakerstreet@gmail.com',
            password: 'gertrudenyenyeshi'
          })
          .end(function(err, res) {
            expect(res.status).to.equal(409);
            assert.strictEqual(res.status, 409);
            assert.strictEqual(res.body.error, 'Sign up failed. This Email or Username is already in use');
            expect(res.body.error).to.have.string('Sign up failed. This Email or Username is already in use');
            done();
          });
      });

      it('The user has a first and last name', function(done) {
        assert.strictEqual(user.name.first, 'Sherlock');
        assert.strictEqual(user.name.last, 'Holmes');
        expect(user.name.first).to.be.a('string');
        expect(user.name.last).to.be.a('string');
        done();
      });

      it('User created must have a role', function(done) {
        expect(user.roleId).to.not.be.undefined;
        expect(user.roleId).to.be.a('string');
        done();
      });

      it('User must be authenticated to see list of other users', function(done) {
        server
          .get('/api/users')
          .end(function(err, res) {
            assert.strictEqual(res.status, 401);
            assert.strictEqual(res.body.message, 'You are not authenticated');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.have.a.string('not authenticated');
            done();
          });
      });

      it('Logged in user gets a token', function(done) {
        server
          .post('/api/users/login')
          .send({
            username: 'Watson',
            password: 'gertrudenyenyeshi'
          })
          .end(function(err, res) {
            token = res.body.token;
            assert.strictEqual(res.status, 200);
            expect(res.body.token).to.not.be.undefined;
            done();
          });
      });
      it('Authenticated user can see list of all users in the system', function(done) {
        server
          .get('/api/users')
          .set('x-access-token', token)
          .end(function(err, res) {
            assert.strictEqual(res.status, 200);
            expect(res.body).to.have.length.above(0);
            expect(res.body).to.be.instanceof(Array);
            done();
          });
      });
      it('User can update his/her details', function(done) {
        server
          .put('/api/users/' + user._id)
          .set('x-access-token', token)
          .send({
            lastname: 'Smaug'
          })
          .end(function(err, res) {
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.name.last, 'Smaug');
            expect(res.body.name.last).to.have.a.string('Smaug');
            expect(res.body.name.last).to.be.a('string');
            done();
          });
      });

      it('User can view all documents he/she created. User without document.', function(done) {
        server
          .get('/api/users/' + user._id + '/documents')
          .set('x-access-token', token)
          .end(function(err, res) {
            assert.strictEqual(res.status, 404);
            assert.strictEqual(res.body.message, 'No documents found');
            done();
          });
      });

      it('User can be deleted, but by Admin only', function(done) {
        server
          .delete('/api/users/' + user._id)
          .set('x-access-token', token)
          .end(function(err, res) {
            assert.strictEqual(res.status, 403);
            assert.strictEqual(res.body.message, 'You need to be an Admin to perform this action');
            expect(res.body.message).to.have.a.string('You need to be an Admin to perform this action');
            done();
          });
      });

      it('User can log out', function(done) {
        server
          .get('/api/users/logout')
          .set('x-access-token', token)
          .end(function(err, res) {
            assert.strictEqual(res.status, 200);
            assert.deepEqual(res.body.message, 'You have logged out successfully');
            server
              .get('/api/users')
              .set('x-access-token', token)
              .end(function(err, res) {
                assert.strictEqual(res.status, 401);
                assert.strictEqual(res.body.message, 'Failed to Authenticate. You are not logged in.');
                done();
              });
          });
      });

      it('Admin has the rights to delete any user', function(done) {
        server
          .post('/api/users/login')
          .send({
            username: 'Sheshe',
            password: 'gertrudenyenyeshi'
          })
          .end(function(err, res) {
            token1 = res.body.token;
            admin = res.body;
            assert.strictEqual(res.status, 200);
            server
              .delete('/api/users/' + user._id)
              .set('x-access-token', token1)
              .end(function(err, res) {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(res.body.message, 'User deleted successfully');
                done();
              });
          });
      });
      it('User can view all documents he/she created. User with documents.', function(done) {
        server
          .get('/api/users/' + admin.user._id + '/documents')
          .set('x-access-token', token1)
          .end(function(err, res) {
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.length, 3);
            done();
          });
      });
    });
  });
})();
