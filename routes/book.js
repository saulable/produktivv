var express = require('express');
var mongoose = require('mongoose');
var Book = require('../models/Book');
const passport = require('passport');
require('../config/passport')(passport);

module.exports = app => {
	app.post('/api/book', passport.authenticate('jwt', { session: false }), function(
		req,
		res,
		next
	) {
		const token = getToken(req.headers);
		if (token) {
			Book.create(req.body, function(err, post) {
				if (err) return next(err);
				res.json(post);
			});
		} else {
			return res.status(403).send({ success: false, msg: 'Unauthorized' });
		}
	});
	app.get('/api/book', passport.authenticate('jwt', { session: false }), function(
		req,
		res,
		next
	) {
		const token = getToken(req.headers);
		if (token) {
			Book.find(function(err, books) {
				if (err) return next(err);
				res.json(books);
			});
		} else {
			return res.status(403).send({ success: false, msg: 'Unauthorized' });
		}
	});
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
