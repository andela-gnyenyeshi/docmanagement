// Require mongoose module
var mongoose = require('mongoose'),
	Schema = mongoose.schema;

// User Schema
var userSchema = new Schema({
	id: Number,
	username: {
		type: String,
		required: true,
		unique: true
	},
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
