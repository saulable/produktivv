const mongoose = require('mongoose');
const {Schema} = mongoose;

const repeatTaskSchema = new Schema({
	message: String,
	completed: {type: Boolean, default: false},
	journal: String,
	note: {type: String, default: ''},
	created_at: Date,
	completed_at: Date,
	start_date: Date,
	end_date: Date,
	index: Number,
	_user: {type: Schema.Types.ObjectId, ref: 'User'},
	repeat: Boolean,
	repeatTime: Number,
	timeInterval: String,
	daysSelected: Array,
	nthdayMonth: String,
	monthChoice: String,
	activeRepeatRadio: String,
	endsOnDate: Date,
	afterCompletes: Number,
	lastCompleted: Date,
	totalCompletes: {type: Number, default: 0},
	taskDuration: String,
	taskType: {type: String, default: 'repeat'},
	datesCompleted: {type: Array, default: []}
});

mongoose.model('repeatTask', repeatTaskSchema, 'repeat_tasks');
