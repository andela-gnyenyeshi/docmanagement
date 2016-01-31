(function() {
  'use strict';
  var request = require('supertest');
  var server = request.agent('http://127.0.0.1:4040');
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
            expect(res.status).toEqual(200);
            user = res.body;
            expect(res.body.name.first).toBe('Sherlock');
            expect(typeof res.body.name.first).toBe('string');
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
            expect(res.status).toEqual(449);
            expect(res.body.error).toBe('Sign up failed. This Email or Username is already in use');
            done();
          });
      });

      it('The user has a first and last name', function(done) {
        expect(user.name.first).toBe('Sherlock');
        expect(user.name.last).toBe('Holmes');
        expect(typeof user.name.first).toBe('string');
        expect(typeof user.name.last).toBe('string');
        done();
      });

      it('User created must have a role', function(done) {
        expect(user.roleId).toBeDefined();
        expect(typeof user.roleId).toBe('string');
        done();
      });

      it('User must be authenticated to see list of other users', function(done) {
        server
          .get('/users')
          .end(function(err, res) {
            expect(res.status).toBe(401);
            expect(res.body.error).toBe('You are not logged in');
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
            expect(res.status).toBe(200);
            expect(res.body._id).toBeDefined();
            expect(typeof res.body).toBe('object');
            done();
          });
      });

      it('Authenticated user can see list of all users in the system', function(done) {
        server
          .get('/users')
          .end(function(err, res) {
            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
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
            expect(res.status).toBe(200);
            expect(res.body.name.last).toBe('Smaug');
            done();
          });
      });

      it('User can be deleted, but by Admin only', function(done) {
        server
          .delete('/users/' + user._id)
          .end(function(err, res) {
            expect(res.status).toBe(403);
            expect(res.body.message).toBe('You need to be an Admin to perform this action');
            done();
          });
      });

      it('User can log out', function(done) {
        server
          .get('/users/logout')
          .end(function(err, res) {
            expect(res.body).toEqual({});
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
            expect(res.status).toBe(401);
            expect(res.body.error).toBe('You are not logged in');
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
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            server
              .post('/documents')
              .send({
                title: 'Utonium',
                content: 'TownsVille'
              })
              .end(function(err, res) {
                expect(res.status).toBe(200);
                expect(res.body).toBeDefined();
                expect(typeof res.body).toBe('object');
                expect(res.body.content).toBe('TownsVille');
                expect(res.body.title).toBe('Utonium');
                expect(res.body.ownerId).toBe(user._id);
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
            expect(res.status).toBe(500);
            expect(res.body.errmsg).toBe('E11000 duplicate key error index: dms.documents.$title_1 dup key: { : "Utonium" }');
            done();
          });
      });
      it('User with role of Viewer can view documents available to that role and are not private', function(done) {
        server
          .get('/documents')
          .end(function(err, res) {
            documents = res.body;
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
            expect(res.body[0].accessId).toBe(user.roleId);
            expect(res.body[1].accessId).toBe(user.roleId);
            expect(res.body[1].accessId).toBe(user.roleId);
            expect(res.body[0].accessType).toBe('None');
            expect(res.body[1].accessType).toBe('None');
            expect(res.body[1].accessType).toBe('None');
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
            expect(res.status).toBe(200);
            expect(typeof res.status).toBe('number');
            expect(typeof res.body).toBe('object');
            expect(res.body).toBeDefined();
            expect(documents[1].ownerId).toBe(user._id);
            expect(res.body.title).toBe('Prof Utonium');
            done();
          });
      });
      it('User cannot delete a document unless they are the owner or an Admin', function(done) {
        server
          .delete('/documents/' + documents[0]._id)
          .end(function(err, res) {
            expect(res.status).toBe(403);
            expect(res.body.message).toBe('You need to be Owner or Admin to delete this Document');
            done();
          });
      });
      it('User can delete a document if they are the owner', function(done) {
        server
          .delete('/documents/' + documents[1]._id)
          .end(function(err, res) {
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Document has been deleted');
            done();
          });
      });
      it('Returns document by limit provided', function(done) {
        server
          .get('/documents/?limit=2')
          .end(function(err, res) {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            done();
          });
      });
      it('Returns documents according to date created', function(done) {
        server
          .get('/documents')
          .end(function(err, res) {
            expect(res.status).toBe(200);
            expect(res.body[0].dateCreated).toBeGreaterThan(res.body[1].dateCreated);
            expect(typeof res.body).toBe('object');
            done();
          });
      });
      it('User can view all documents he/she created', function(done) {
        server
          .get('/documents/one')
          .end(function(err, res) {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
            expect(res.body[0].ownerId).toBe(user._id);
            expect(res.body[1].ownerId).toBe(user._id);
            expect(res.body[2].ownerId).toBe(user._id);
            expect(typeof res.body).toBe('object');
            documents = res.body;
            done();
          });
      });
      it('Documents set to private can be seen by the owner', function(done) {
        server
          .get('/documents/one')
          .end(function(err, res) {
            expect(res.body[1].accessType).toBe('Private');
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
              expect(res.body[0].accessId).toBe(res.body[0].accessId);
              expect(res.body.length).toBeGreaterThan(0);
              done();
            });
        });
        it('Documents can be searched by Date created', function(done) {
          server
            .get('/documents/date' + '?from=2016-01-30&to=2016-02-09')
            .end(function(err, res) {
              expect(res.body.length).toBe(2);
              expect(res.status).toBe(200);
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
              expect(res.status).toBe(403);
              expect(res.body.message).toBe('You need to be an Admin');
              done();
            });
        });
        it('Role can be updated by Admin only', function(done) {
          server
            .get('/roles/' + user.roleId)
            .end(function(err, res) {
              expect(res.status).toBe(403);
              expect(res.body.message).toBe('You need to be an Admin to perform this.');
              done();
            });
        });
        it('Roles can be searched by Admin only', function(done) {
          server
            .get('/roles')
            .end(function(err, res) {
              expect(res.status).toBe(403);
              expect(res.body.message).toBe('You need to be an Admin to perform this');
              done();
            });
        });
        it('Role can be deleted by Admin only', function(done) {
          server
            .delete('/roles/' + user.roleId)
            .end(function(err, res) {
              expect(res.status).toBe(403);
              expect(res.body.message).toBe('You must be an Admin to perform this action');
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
              expect(res.status).toBe(403);
              expect(res.body.message).toBe('You need to be an Admin');
              done();
            });
        });
        it('Type can be updated by Admin only', function(done) {
          server
            .get('/roles/' + documents[0].typeId)
            .end(function(err, res) {
              expect(res.status).toBe(403);
              expect(res.body.message).toBe('You need to be an Admin to perform this.');
              done();
            });
        });
        it('Types can be searched by Admin only', function(done) {
          server
            .get('/types')
            .end(function(err, res) {
              expect(res.status).toBe(403);
              expect(res.body.message).toBe('You need to be an Admin to perform this');
              done();
            });
        });
        it('Types can be deleted by Admin only', function(done) {
          server
            .delete('/types/' + documents[2].typeId)
            .end(function(err, res) {
              expect(res.status).toBe(403);
              expect(res.body.message).toBe('You must be an Admin to perform this action');
              done();
            });
        });
      });
    });

  });
})();
