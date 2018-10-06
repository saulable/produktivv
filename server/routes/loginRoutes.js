const mongoose = require('mongoose');
const passport = require('passport');
const express = require('express');

const User = require('../models/User');
const jwt = require('jsonwebtoken');

const settings = require('../config/settings');
require('../services/facebookPassport')(passport);

module.exports = (app, passport) => {
	// send to facebook to do the authentication
	app.get(
		'/auth/facebook',
		passport.authenticate('facebook', { scope: 'email' })
	);
	app.get('/api/testme', (req,res) =>{
		console.log(123);
		res.send('Hello saul');
	});
	app.get(
		'/auth/facebook/callback',
		passport.authenticate('facebook', {
			session: false
		}), (req, res) => {
			const token = jwt.sign(req.user.toJSON(), settings.secret);
			res.cookie('jwtToken', token);
			res.redirect('/social_auth');
		}
	);
	app.post(
		'/connect/local',
		passport.authenticate('local-signup', {
			successRedirect: '/profile', // redirect to the secure profile section
			failureRedirect: '/connect/local', // redirect back to the signup page
			failureFlash: true // allow flash messages
		})
	);
	// facebook ------- authorization.
	app.get(
		'/connect/facebook',
		passport.authorize('facebook', {
			scope: ['public_profile', 'email']
		})
	);
	// handle the callback after facebook has authorized the user
	app.get(
		'/connect/facebook/callback',
		passport.authorize('facebook', {
			successRedirect: '/profile',
			failureRedirect: '/'
		})
	);
	// route middlewarer to ensure user is logged in before authorization
	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) return next();
		res.redirect('/');
	}
};
