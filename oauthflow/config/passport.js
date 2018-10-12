const JwtStrategy = require('passport-jwt').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { ExtractJwt } = require('passport-jwt');

// load up the user model

const User = require('../models/User');
const settings = require('./settings'); // get settings file.
const keys = require('./keys');

module.exports = passport => {
	let opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
	opts.secretOrKey = settings.secret;
	passport.use(
		new JwtStrategy(opts, function(jwt_payload, done) {
			User.findOne({ id: jwt_payload.id }, function(err, user) {
				if (err) {
					return done(err, false);
				}
				if (user) {
					done(null, user);
				} else {
					done(null, false);
				}
			});
		})
	);
	passport.use(
		new FacebookStrategy(
			{
				clientID: keys.facebookClientId,
				clientSecret: keys.facebookSecretId,
				callbackURL: keys.facebookCallBackUrl,
				proxy: true
			},
			async (accessToken, refershToken, profile, done) => {
				let exisitingUser = await User.findOne({ facebookId: profile.id });
				if (exisitingUser) {
					return done(null, exisitingUser);
				}
				let user = await new User({facebookId: profile.id}).save();
				done(null, user);
			}
		)
	);
};
