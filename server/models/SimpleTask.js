const mongoose = require('mongoose');
const {Schema} = mongoose;

const simpleTaskSchema = new Schema({
	message: String,
	completed: {type: Boolean, default: false},
	journal: String,
	note: String,
	created_at: Date,
	completed_at: Date,
	start_date: Date,
	end_date: Date,
	index: Number,
	_user: {type: Schema.Types.ObjectId, ref: 'User'},
	repeat: Boolean,
	repeatTime: Number,
	timeInterval: String,
	nthdayMonth: String,
	monthlyRepeat: String,
	activeRepeatRadio: String,
	endsOnDate: Date,
	afterCompletes: Number,
	lastCompleted: Date,
	totalCompletes: Number,
	taskDuration: String,
	switchRepeats: String,
	taskType: {type: String, default: 'simple'},
	task_status: String
});

mongoose.model('simpleTask', simpleTaskSchema, 'simple_tasks');
