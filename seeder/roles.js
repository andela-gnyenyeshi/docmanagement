(function() {
	'use strict';
	var config = require('../config/config'),
		MongoClient = require('mongodb').MongoClient,
		assert = require('assert'),
		url = config.db,

		data = [{
			title: 'Admin'
		}, {
			title: 'Staff'
		}, {
			title: 'Viewer'
		}];

	function insert(db, done) {
		db.collection('roles').insertMany(data, function(err, result) {
			assert.equal(null, err);
			console.log('Roles have been added to the Document');
			done(result);
		});
	}

	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		insert(db, function() {
			db.close();
		});
	});
})();
