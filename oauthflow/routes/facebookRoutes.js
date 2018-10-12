const mongoose = require('mongoose');
const passport = require('passport');
const express = require('express');

const User = require('../models/User');
const jwt = require('jsonwebtoken');

const settings = require('../config/settings');
const keys = require('../config/keys');
require('./facebookPassport')(passport);

module.exports = (app, passport) => {
	// send to facebook to do the authentication
	app.get(
		'/auth/facebook',
		passport.authenticate('facebook', { scope: 'email' })
	);
	app.get(
		'/api/testme', (req, res) => {
			console.log(123);
			res.send('Hello Saul');
		}
	);
	app.get(
		'/auth/facebook/callback',
		passport.authenticate('facebook', {
			session: false
		}), (req, res) => {
			const token = jwt.sign(req.user.toJSON(), settings.secret);
			res.cookie('jwtToken', token);
			res.redirect(`${keys.hostURL}/social_auth`);
		}
	);
};
