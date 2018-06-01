const mongoose = require('mongoose');
const {Schema} = mongoose;

const tasksSchema = new Schema({
	message: String,
	completed: {type: Boolean, default: false},
	journal: String,
	note: {type: String, default: ''},
	created_at: Date,
	completed_at: Date,
	index: Number, 
	_user: {type: Schema.Types.ObjectId, ref: 'User'}
});

mongoose.model('tasks', tasksSchema);
