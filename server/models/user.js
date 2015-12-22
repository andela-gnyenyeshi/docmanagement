// Require mongoose module
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// User Schema
var userSchema = new Schema({
	name: {
		first: {
			type: String,
			required: true
		},
		last: {
			type: String,
			required: true
		}
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
});

// Create model and export
module.exports = mongoose.model('User', userSchema);
