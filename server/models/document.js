// Require mongoose
var mongoose = require('mongoose'),
	Schema = mongoose.schema;

// Document Schema
var documentSchema = new Schema({
	ownerId: {
		type: Number,
		required: true,
		unique: true
	},
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	access: {
		type: String,
		required: true
	},
	dateCreated: {
		type: Date,
		required: true
	},
	lastModified: {
		type: Date,
		required: true
	}
});

// Create model and export
module.exports = mongoose.model('Document', documentSchema);
