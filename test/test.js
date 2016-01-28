var supertest = require('supertest'),
  should = require('should'),
  app = require('../document-manager.js'),
  seeder = require('../seeder/seeds'),
  supertest = require('supertest'),
  User = require('../server/models/user'),
  server = supertest.agent('http://127.0.0.1:4040');

  seeder.starter(function(ok) {
    console.log(ok);
  });

  // describe('Before Each', function(done) {
  //   // this.timeout(15000);
  //   // setTimeout(done, 15000);
  //   beforeEach(function() {
  //     seeder.starter(function(ok) {
  //       console.log(ok);
  //     });
  //   });
  //
  //   it ('Should log in user', function(done) {
  //     // server
  //     //  .post('/users/login')
  //     //  .send({
  //     //    username: 'Sheshe',
  //     //    password: 'gertrudenyenyeshi'
  //     //  })
  //     //  .set('Accept', 'application/json')
  //     //  .end(function(err, res){
  //     //   //  expect(res.status).toEqual(200);
  //     //    done();
  //     //  });
  //   });
  // });

//     describe('sample test', function(){
//       it ('Should log in user', function(done) {
//         server
//          .post('/users/login')
//          .send({
//            username: 'Sheshe',
//            password: 'gertrudenyenyeshi'
//          })
//          .end(function(err, res){
//            expect(res.status).toEqual(200);
//            done();
//          });
//       });
//     });
//
//
// describe('Role Spec', function(done) {
//   beforeEach(function(done){
//     user = new User({
//
//     });
//   });
// });
