const passport = require('passport');
const jwt = require('jsonwebtoken');

module.exports = app => {
	const generateToken = (req, res) => {
		token.generateAccessToken(req.user.id);
		res.render('authenticated.html', {
			token: accessToken
		});
	};
};
