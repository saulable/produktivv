var mongoose = require('mongoose');
var { Schema } = mongoose;
var bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
	local: {
		email: { type: String, unique: true },
		password: String
	},
	facebook: {
		id: String,
		token: String,
		email: String,
		name: String
	},
	twitter: {
		id: String,
		token: String,
		displayName: String,
		username: String
	},
	google: {
		id: String,
		token: String,
		email: String,
		name: String
	}
});

UserSchema.pre('save', function(next) {
	var user = this;

	// check to see if it's a local signup and hash the password or a password update.
	if (
		(this.isModified('local.password') || this.isNew) &&
		!this.isModified('facebook.id') && !this.isModified('google.id') && !this.isModified('twitter.id')
	) {
		bcrypt.genSalt(10, function(err, salt) {
			if (err) {
				return next(err);
			}
			bcrypt.hash(user.local.password, salt, null, function(err, hash) {
				if (err) {
					return next(err);
				}
				user.local.password = hash;
				next();
			});
		});
	} else {
		return next();
	}
});

UserSchema.methods.comparePassword = function(passw, cb) {
	bcrypt.compare(passw, this.local.password, function(err, isMatch) {
		if (err) {
			return cb(err);
		}
		cb(null, isMatch);
	});
};

module.exports = mongoose.model.User || mongoose.model('User', UserSchema);
