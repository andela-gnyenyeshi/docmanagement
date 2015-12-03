// Require Mongoose
var mongoose = require('mongoose'),
	Schema = mongoose.schema;

// Role schema
var roleSchema = new Schema({
	id: {
		type: Number,
		required: true
	},
	title: {
		type: String,
		required: true,
		unique: true
	}
});

// Create model and export
module.exports = mongoose.model('Role', roleSchema);
