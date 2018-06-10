const mongoose = require('mongoose');
const { Schema } = mongoose;

const hatSchema = new Schema({
	name: String,
	completed: { type: Boolean, default: false },
	completed_date: Date,
	created_at: Date,
	tasks: Array,
	journal: String,
	_user: { type: Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('hats', hatSchema);
