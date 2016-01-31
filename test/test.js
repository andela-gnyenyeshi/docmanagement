(function() {
  var request = require('supertest');
  var app = require('../document-manager.js');
  var expect = require('chai').expect,
  server = request.agent('http://127.0.0.1:4040');
  var helper = require('../seeder/seeds');

  describe('Document Managemet System', function() {
    describe('User creation', function(){
      var user;
      it ('A new user can be created', function(done) {
        server
         .post('/users')
         .send({
           firstname: 'Sherlock',
           lastname: 'Holmes',
           username: 'Watson',
           email: 'bakerstreet@gmail.com',
           password: 'gertrudenyenyeshi'
         })
         .end(function(err, res){
           res.status.should.equal(200);
           user = res.body;
           res.body.name.first.should.be('Sherlock');
          //  expect(res.body.name.first).toBe('Sherlock');
          //  expect(typeof res.body.name.first).toBe('string');
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
        done();
      });

      it('Lists all users in the system', function(done){
        server
          .get('/users')
          .end(function(err, res) {
            expect(res.status).toBe(800);
            console.log(user);
            expect(res.body).toBe('p');
            // done();
          });
      });

      it('User created must have a role', function(done) {
        expect(user.roleId).toBeDefined();
        done();
      });


      // it('Creates user session object when User logs in', function(done){
      //   server
      //     .post('/users/login')
      //     .send({
      //       username: 'Watson',
      //       password: 'gertrudenyenyeshi'
      //     })
      //     .end(function(err, res) {
      //       expect(res.status).toBe(200);
      //       expect(res.body._id).toBeDefined();
      //       expect(typeof res.body).toBe('object');
      //       done();
      //     });
      // });


    });
  });
})();
