const mongoose = require('mongoose');
const { Schema } = mongoose;

const trackSchema = new Schema({
	tracks : Array,
	_user: { type: Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('tracks', trackSchema);
