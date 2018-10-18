/* global process */
const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require('../config/keys');
const User = require('../models/User');
module.exports = passport => {
	passport.use(
		new FacebookStrategy(
			{
				// pull in our app id and secret from config
				clientID: keys.facebookClientId,
				clientSecret: keys.facebookSecretId,
				callbackURL: keys.facebookCallBackUrl,
				passReqToCallback: true,
				profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'],

			},
			// facebook will send back the token and profile
			function(req, token, refershToken, profile, done) {
				// async
				process.nextTick(function() {
					// check if the user is logged
					if (!req.user) {
						User.findOne({ 'facebook.email': profile.email }, (err, user) => {
							// if there is an error stop everything and return
							if (err) return done(err);
							// if the user is found, then log them in
							if (user) {
								return done(null, user); // user found, return that user
							} else {
								// if there is no user found with that facebook id, create them
								const newUser = new User();
								// set all of the facebook information in our user model
								newUser.facebook.id = profile.id; // set the users facebook
								newUser.facebook.token = token; // we will save that token from facebook
								newUser.facebook.name =
									profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
								newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first.

								// save our user to the database
								newUser.save(function(err) {
									if (err) {
										throw err;
									} else {
										// if successfull, return the new user
										return done(null, newUser);
									}
								});
							}
						});
					} else {
						// user already exists and is logged in, we have to link accounts.
						const user = req.user; // pull the user out of the session.
						// update the current users facebook credentials.
						user.facebook.id = profile.id;
						user.facebook.token = token;
						user.facebook.name = profile.name.givenName + ' ' + profile.name.famileName;
						user.facebook.email = profile.emails[0].value;
						// save the user

						user.save(function(err) {
							if (err) throw err;
							return done(null, user);
						});
					}
				});
			}
		)
	);
};
