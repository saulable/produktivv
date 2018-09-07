const mongoose = require('mongoose');
const { Schema } = mongoose;

const trackSchema = new Schema({
	title: String,
	key: String,
	created_at: {type: Date, default: Date.now() },
	tasks: [],
	treeData: [],
	_user: { type: Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('tracks', trackSchema);
