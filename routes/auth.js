const mongoose = require('mongoose');
const passport = require('passport');
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const User = require('../models/User');

const settings = require('../config/settings');
require('../services/localPassport')(passport);

module.exports = (app, passport) => {

	app.post('/api/auth/register', async (req, res, next) => {
		if (!req.body.username || !req.body.password) {
			res.json({ success: false, msg: 'Please pass username and password' });
		} else {
			const findUser = await User.findOne({
				'local.email': req.body.username
			}).exec();
			// if profile exists, return the user.
			if (findUser){
				res.json({ success: false, msg: 'Username already exists' });
			}else {
				await User({
					'local.email': req.body.username,
					'local.password': req.body.password
				}).save((err, result) => {
					if (err) res.json({ success: false, msg: 'Username already exists' });
					else {
						res.json({ success: true, msg: 'Successfuly created new user' });
					}
				});
			}
		}
	});
	app.post('/api/auth/login', async (req, res) => {
		await User.findOne({'local.email': req.body.username}, (err, user) => {
			if (err) throw err;
			if (!user) {
				res.status(401).send({
					success: false,
					msg: 'Authentication failed. User not found.'
				});
			} else {
				// check if password matches
				user.comparePassword(req.body.password, function(err, isMatch) {
					if (isMatch && !err) {
						// if user is found and password is right create a token
						const token = jwt.sign(user.toJSON(), settings.secret);
						// return the information including token as json
						res.json({ success: true, token: 'JWT ' + token });
					} else {
						res
							.status(401)
							.send({ success: false, msg: 'Authentication failed.' });
					}
				});
			}
		});
	});
	app.get(
		'/api/logged_in',
		passport.authenticate('jwt', { session: false }),
		(req, res) => {
			const token = getToken(req.headers);
			if (token) {
				// some logic goes here for calling a db, but in this case we're just checking that there is a token.
				res.json(true);
			} else {
				res.status(403).send({ success: false, msg: 'Unauthorized' });
			}
		}
	);
	const getToken = headers => {
		if (headers && headers.authorization) {
			const parted = headers.authorization.split(' ');
			if (parted.length === 2) {
				return parted[1];
			} else {
				return null;
			}
		} else {
			return null;
		}
	};
};
