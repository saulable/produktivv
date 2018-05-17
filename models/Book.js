const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookSchema = new Schema({
	isbn: String,
	title: String,
	author: String,
	description: String
});

module.exports = mongoose.model('books', BookSchema);
