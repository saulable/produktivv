const mongoose = require('mongoose');
const { Schema } = mongoose;

const trackTreeSchema = new Schema({
	tree: Array,
	_user: { type: Schema.Types.ObjectId, ref: 'User' },
	created_at: Date
});
mongoose.model('trackstree', trackTreeSchema);
