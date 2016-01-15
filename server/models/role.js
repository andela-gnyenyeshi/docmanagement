// Require Mongoose
var mongoose = require('mongoose'),
	Schema = mongoose.schema;

// Role schema
var roleSchema = new Schema({
	title: {
		type: String,
		required: true,
		unique: true
	}
});

// Create model and export
module.exports = mongoose.model('Role', roleSchema);
