(function() {
  'use strict';
  var config = require('../config/config'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    url = config.db;

  function roles(db, done) {
    db.collection('roles').drop(function(err, message) {
      console.log(message);
      done();
    });
  }

  function users(db, done) {
    db.collection('users').drop(function(err, message) {
      console.log(message);
      done();
    });
  }

  function type(db, done) {
    db.collection('types').drop(function(err, message) {
      console.log(message);
      done();
    });
  }

  function document(db, done) {
    db.collection('documents').drop(function(err, message) {
      console.log(message);
      done();
    });
  }
module.exports = {
  clear: function() {
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      roles(db, function() {});
      users(db, function() {});
      type(db, function() {});
      document(db, function() {});
    });
  }
};
})();
