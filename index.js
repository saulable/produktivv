/* global __dirname process env */
const mongoose = require('mongoose');
const express = require('express');
const cookieSession = require('cookie-session');
const keys = require('./config/keys');
const bodyParser = require('body-parser');
const auth = require('./routes/auth');
const passport = require('passport');
const https = require('https');
const fs = require('fs');
require('./models/Tasks');
require('./models/DailyJournals');

// used for development purposes.
const morgan = require('morgan');

const options = {
	key: fs.readFileSync('./key.pem'),
	cert: fs.readFileSync('./cert.pem'),
};
mongoose
	.connect(keys.mongoURI)
	.then(() => console.log('connection successful'))
	.catch(err => console.log(err));

const app = express();

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000,
		keys: 'dashgkjlahgfkljashfkjasdflkhasdfjklh'
	})
);
// app.use(localJWT.initialize());
require('./routes/book')(app);
require('./routes/auth')(app, passport);
require('./routes/loginRoutes')(app, passport);
require('./routes/tasksRoutes')(app);

if (process.env.NODE_ENV === 'production') {
	// Express will serve up production assets.
	// Like our main.js file, or main.css file
	app.use(express.static('client/build'));
	// Express will serve up the index.html file if it doesn't know the route....
	const path = require('path');
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

const PORT = process.env.PORT || 5000;
const server = https.createServer(options, app).listen(PORT, function() {
	console.log('server started at port' + PORT);
});
