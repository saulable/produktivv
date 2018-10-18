const fs = require('fs');

module.exports = {
	mongoURI: fs.readFileSync('/run/secrets/mongoURI', 'utf8').trim(),
	facebookClientId : fs.readFileSync('/run/secrets/fb_client', 'utf8').trim(),
	facebookSecretId : fs.readFileSync('/run/secrets/fb_secret', 'utf8').trim(),
	facebookCallBackUrl:  fs.readFileSync('/run/secrets/fb_cb_url', 'utf8').trim(),
	googleClientID: fs.readFileSync('/run/secrets/google_client', 'utf8').trim(),
	googleClientSecret: fs.readFileSync('/run/secrets/google_secret', 'utf8').trim(),
	hostURL: 'https://www.produktivv.com'
};
