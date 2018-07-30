const mongoose = require('mongoose');
const { Schema } = mongoose;

const dailyTaskListSchema = new Schema({
	forDate: Date,
	created: { type: Date, default: Date.now() },
	taskList: Array,
	indexes: Array,
	_user: { type: Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('dailyTaskList', dailyTaskListSchema, 'daily_tasklist');
