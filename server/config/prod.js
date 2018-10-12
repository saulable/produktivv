const fs = require('fs');

module.exports = {
	mongoURI: fs.readFileSync('/run/secrets/mongoURI', 'utf8').trim(),
};
