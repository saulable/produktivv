const mongoose = require('mongoose');
const { Schema } = mongoose;

const trackSchema = new Schema({
	name: String,
	key: String,
	created_at: {type: Date, default: Date.now() },
	tasks: [],
	_user: { type: Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('tracks', trackSchema);
