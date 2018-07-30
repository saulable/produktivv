const mongoose = require('mongoose');
const {Schema} = mongoose;

const dailyJournalSchema = new Schema({
	message: String,
	created_at: Date,
	_user: {type: Schema.Types.ObjectId, ref: 'User'}
});

mongoose.model('dailyjournals', dailyJournalSchema, 'daily_journals');
