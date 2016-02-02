(function() {
  var request = require('supertest');
  var app = require('../app.js');
  var expect = require('chai').expect;
  var should = require('should');
  var assert = require('assert');
  server = request.agent('http://127.0.0.1:4040');
  var helper = require('../seeder/seeds');

  describe('Document Management System', function() {
      var user, documents;
    // beforeAll(function(done) {
    //   helper.starter(ok);
    //   done();
    // });

    describe('User creation', function() {
      it('A new user can be created', function(done) {
        server
          .post('/users')
          .send({
            firstname: 'Sherlock',
            lastname: 'Holmes',
            username: 'Watson',
            email: 'bakerstreet@gmail.com',
            password: 'gertrudenyenyeshi'
          })
          .end(function(err, res) {
            assert.strictEqual(res.status, 200);
            user = res.body;
            assert.strictEqual(res.body.name.first, 'Sherlock');
            expect(res.body.name.first).to.have.string('Sherlock');
            expect(res.body.name.first).to.be.a('string');
            done();
          });
      });

      it('The new user must be unique', function(done) {
        server
          .post('/users')
          .send({
            firstname: 'Sherlock',
            lastname: 'Holmes',
            username: 'Watson',
            email: 'bakerstreet@gmail.com',
            password: 'gertrudenyenyeshi'
          })
          .end(function(err, res) {
            expect(res.status).to.equal(449);
            assert.strictEqual(res.status, 449);
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
          .get('/users')
          .end(function(err, res) {
            assert.strictEqual(res.status, 401);
            assert.strictEqual(res.body.error, 'You are not logged in');
            expect(res.body.error).to.be.a('string');
            expect(res.body.error).to.have.a.string('You are not logged in');
            done();
          });
      });


      it('Creates user session object when User logs in', function(done) {
        server
          .post('/users/login')
          .send({
            username: 'Watson',
            password: 'gertrudenyenyeshi'
          })
          .end(function(err, res) {
            assert.strictEqual(res.status, 200);
            expect(res.body._id).to.not.be.undefined;
            expect(res.body).to.be.a('object');
            done();
          });
      });
      //
      it('Authenticated user can see list of all users in the system', function(done) {
        server
          .get('/users')
          .end(function(err, res) {
            assert.strictEqual(res.status, 200);
            expect(res.body).to.have.length.above(0);
            expect(res.body).to.be.instanceof(Array);
            done();
          });
      });
      it('User can update his/her details', function(done) {
        server
          .put('/users/' + user._id)
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

      it('User can be deleted, but by Admin only', function(done) {
        server
          .delete('/users/' + user._id)
          .end(function(err, res) {
            assert.strictEqual(res.status, 403);
            assert.strictEqual(res.body.message, 'You need to be an Admin to perform this action');
            expect(res.status).to.equal(403);
            expect(res.body.message).to.have.a.string('You need to be an Admin to perform this action');
            done();
          });
      });

      it('User can log out', function(done) {
        server
          .get('/users/logout')
          .end(function(err, res) {
            //expect(res.body).to.equal({});
            assert.deepEqual(res.body, {});
            done();
          });
      });
    });

    describe('Documents', function() {
      it('You must be logged in to create a document', function(done) {
        server
          .post('/documents')
          .send({
            title: 'Mega Mind',
            content: 'TightenVille'
          })
          .end(function(err, res) {
            assert.strictEqual(res.status, 401);
            assert.strictEqual(res.body.error, 'You are not logged in');
            expect(res.body.error).to.be.a('string');
            done();
          });
      });
      it('User can create documents if they are authenticated', function(done) {
        server
          .post('/users/login')
          .send({
            username: 'Kachuna',
            password: 'anitamrunde'
          })
          .end(function(err, res) {
            user = res.body;
            assert.strictEqual(res.status, 200);
            expect(res.body).to.be.a('object');
            server
              .post('/documents')
              .send({
                title: 'Utonium',
                content: 'TownsVille'
              })
              .end(function(err, res) {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(res.body.content, 'TownsVille');
                assert.strictEqual(res.body.ownerId, user._id);
                assert.strictEqual(res.body.title, 'Utonium');
                expect(res.body).to.not.be.undefined;
                expect(res.body).to.be.a('object');
                done();
              });
          });
      });
      it('Document title is unique', function(done) {
        server
          .post('/documents')
          .send({
            title: 'Utonium',
            content: 'Power Puff'
          })
          .end(function(err, res) {
            assert.strictEqual(res.status, 500);
            expect(res.status).to.equal(500);
            expect(res.body.errmsg).to.have.a.string('E11000 duplicate key error index');
            done();
          });
      });
      it('User with role of Viewer can view documents available to that role and are not private', function(done) {
        server
          .get('/documents')
          .end(function(err, res) {
            documents = res.body;
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body[0].accessId, user.roleId);
            assert.strictEqual(res.body[1].accessId, user.roleId);
            assert.strictEqual(res.body[2].accessId, user.roleId);
            assert.strictEqual(res.body[0].accessType, 'None');
            assert.strictEqual(res.body[1].accessType, 'None');
            assert.strictEqual(res.body[2].accessType, 'None');
            expect(res.body.length).to.equal(3);
            expect(res.body).to.have.length.above(0);
            done();
          });
      });
      it('User can update documents they are owners of or are accessible to their role', function(done) {
        server
          .put('/documents/' + documents[1]._id)
          .send({
            title: 'Prof Utonium'
          })
          .end(function(err, res) {
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.title, 'Prof Utonium');
            assert.strictEqual(documents[1].ownerId, user._id);
            expect(typeof res.status).to.equal('number');
            expect(typeof res.body).to.equal('object');
            expect(res.body).to.not.be.undefined;
            done();
          });
      });
      it('User cannot delete a document unless they are the owner or an Admin', function(done) {
        server
          .delete('/documents/' + documents[0]._id)
          .end(function(err, res) {
            assert.strictEqual(res.status, 403);
            assert.strictEqual(res.body.message, 'You need to be Owner or Admin to delete this Document');
            done();
          });
      });
      it('User can delete a document if they are the owner', function(done) {
        server
          .delete('/documents/' + documents[1]._id)
          .end(function(err, res) {
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.message, 'Document has been deleted');
            done();
          });
      });
      it('Returns document by limit provided', function(done) {
        server
          .get('/documents/?limit=2')
          .end(function(err, res) {
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.length, 2);
            expect(res.body).to.have.length.above(1);
            done();
          });
      });
      it('Returns documents according to date created', function(done) {
        server
          .get('/documents')
          .end(function(err, res) {
            assert.strictEqual(res.status, 200);
            (res.body[0].dateCreated).should.be.above(res.body[1].dateCreated);
            expect(res.body).to.be.instanceof(Array);
            done();
          });
      });
      it('User can view all documents he/she created', function(done) {
        server
          .get('/documents/one')
          .end(function(err, res) {
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.length, 3);
            expect(res.body).to.have.length.above(1);
            assert.strictEqual(res.body[0].ownerId, user._id);
            assert.strictEqual(res.body[1].ownerId, user._id);
            assert.strictEqual(res.body[2].ownerId, user._id);
            expect(res.body).to.be.instanceof(Array);
            documents = res.body;
            done();
          });
      });
      it('Documents set to private can be seen by the owner', function(done) {
        server
          .get('/documents/one')
          .end(function(err, res) {
            assert.strictEqual(res.body[1].accessType, 'Private');
            expect(res.body[1].accessType).to.be.a('string');
            done();
          });
      });
    });

    describe('Search', function() {
      describe('Search functions', function() {
        it('Documents can be searched by role', function(done) {
          server
            .get('/documents/' + user.roleId)
            .end(function(err, res) {
              assert.strictEqual(res.body[0].accessId, res.body[0].accessId);
              expect(res.body).to.have.length.above(0);
              done();
            });
        });
        it('Documents can be searched by Date created', function(done) {
          server
            .get('/documents/date' + '?from=2016-01-30&to=2016-02-11')
            .end(function(err, res) {
              console.log(res.body);
              assert.strictEqual(res.body.length, 2);
              assert.strictEqual(res.status, 200);
              expect(res.body).to.have.length(2);
              done();
            });
        });
      });
    });

    describe('Roles', function() {
      describe('Role functions', function() {
        it('Role can be created by Admin only', function(done) {
          server
            .post('/roles')
            .end(function(err, res) {
              assert.strictEqual(res.status, 403);
              assert.strictEqual(res.body.message, 'You need to be an Admin');
              done();
            });
        });
        it('Role can be updated by Admin only', function(done) {
          server
            .get('/roles/' + user.roleId)
            .end(function(err, res) {
              assert.strictEqual(res.status, 403);
              assert.strictEqual(res.body.message, 'You need to be an Admin to perform this.');
              done();
            });
        });
        it('Roles can be searched by Admin only', function(done) {
          server
            .get('/roles')
            .end(function(err, res) {
              assert.strictEqual(res.status, 403);
              assert.strictEqual(res.body.message, 'You need to be an Admin to perform this');
              done();
            });
        });
        it('Role can be deleted by Admin only', function(done) {
          server
            .delete('/roles/' + user.roleId)
            .end(function(err, res) {
              assert.strictEqual(res.status, 403);
              assert.strictEqual(res.body.message, 'You must be an Admin to perform this action');
              done();
            });
        });
      });
    });

    describe('Types', function() {
      describe('Type functions', function() {
        it('Type can be created by Admin only', function(done) {
          server
            .post('/types')
            .end(function(err, res) {
              assert.strictEqual(res.status, 403);
              assert.strictEqual(res.body.message, 'You need to be an Admin');
              done();
            });
        });
        it('Type can be updated by Admin only', function(done) {
          server
            .get('/roles/' + documents[0].typeId)
            .end(function(err, res) {
              assert.strictEqual(res.status, 403);
              assert.strictEqual(res.body.message, 'You need to be an Admin to perform this.');
              done();
            });
        });
        it('Types can be searched by Admin only', function(done) {
          server
            .get('/types')
            .end(function(err, res) {
              assert.strictEqual(res.status, 403);
              assert.strictEqual(res.body.message, 'You need to be an Admin to perform this');
              done();
            });
        });
        it('Types can be deleted by Admin only', function(done) {
          server
            .delete('/types/' + documents[2].typeId)
            .end(function(err, res) {
              assert.strictEqual(res.status, 403);
              assert.strictEqual(res.body.message, 'You must be an Admin to perform this action');
              done();
            });
        });
      });
    });
  });
  })();
