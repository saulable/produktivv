/* global __dirname process env */
const mongoose = require('mongoose');
const express = require('express');
const cookieSession = require('cookie-session');
const keys = require('./server/config/keys');
const bodyParser = require('body-parser');
const auth = require('./server/routes/auth');
const passport = require('passport');
const https = require('https');
const fs = require('fs');
const pug = require('pug');
const path = require('path');
const gulp = require('gulp');


mongoose
	.connect(keys.mongoURI)
	.then(() => console.log('connection successful'))
	.catch(err => console.log(err));

require('./server/models/SimpleTask');
require('./server/models/simpleLongTask');
require('./server/models/DailyJournals');
require('./server/models/Tracks');
require('./server/models/Hats');
require('./server/models/DailyTaskList');
require('./server/models/RepeatTask');
require('./server/models/RedueTask');
require('./server/models/TrackTree');

// used for development purposes.
const morgan = require('morgan');
const options = {
	key: fs.readFileSync('./server/key.pem'),
	cert: fs.readFileSync('./server/cert.pem'),
};


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
require('./server/routes/book')(app);
require('./server/routes/auth')(app, passport);
require('./server/routes/loginRoutes')(app, passport);
require('./server/routes/tasksRoutes')(app);
require('./server/routes/calendarRoutes')(app);
require('./server/routes/trackRoutes')(app);
// require('./server/routes/frontEnd')(app);


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
//
// // reload code
// app.use(express.static('./dist/', {
//     extensions: ['html', 'htm']
// }));

const PORT = process.env.PORT || 5000;
const server = https.createServer(options, app).listen(PORT, function() {
	console.log('server started at port' + PORT);
});
