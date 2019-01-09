/* global __dirname process env */
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// keys for the app
const keys = require('./config/keys');

const mongooseOptions = {
	useNewUrlParser: true,
	keepAlive: 1, 
	connectTimeoutMS: 30000
}
mongoose
	.connect(keys.mongoURI, mongooseOptions)
	.then(() => console.log('connection successful'))
	.catch(err => console.log(err));


require('./models/SimpleTask');
require('./models/SimpleLongTask');
require('./models/DailyJournals');
require('./models/Tracks');
require('./models/Hats');
require('./models/DailyTaskList');
require('./models/RepeatTask');
require('./models/RedueTask');
require('./models/TrackTree');

// used for development purposes.
// const morgan = require('morgan');
const options = {
	key: fs.readFileSync('./keys/server.key'),
	cert: fs.readFileSync('./keys/server.crt')
};

const app = express();

const PORT = process.env.PORT || 5000;
// If we are in production we are already running in https
if (process.env.NODE_ENV === 'production') {
	server = http.createServer(app);
}
// We are not in production so load up our certificates to be able to
// run the server in https mode locally
else {
	const certOptions = {
		key: fs.readFileSync('./keys/server.key'),
		cert: fs.readFileSync('./keys/server.crt')
	};
	// server = https.createServer(certOptions, app);
	server = http.createServer(app);
}
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000,
		keys: 'dashgkjlahgfkljashfkjasdflkhasdfjklh'
	})
);
// const io = socketio(server);
// app.set('io', io);

// app.use(localJWT.initialize());
require('./routes/book')(app);
require('./routes/auth')(app, passport);
require('./routes/loginRoutes')(app, passport);
require('./routes/tasksRoutes')(app);
require('./routes/calendarRoutes')(app);
require('./routes/trackRoutes')(app);
// require('./routes/frontEnd')(app);

// if (process.env.NODE_ENV === 'production') {
// 	// Express will serve up production assets.
// 	// Like our main.js file, or main.css file
// 	app.use(express.static('client/build'));
// 	// Express will serve up the index.html file if it doesn't know the route....
// 	const path = require('path');
// 	app.get('*', (req, res) => {
// 		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
// 	});
// }

app.get('/wake-up', (req, res) => res.send('👍'));
app.listen(process.env.PORT || 5000, () => {
	console.log('listening... on port' + PORT);
});
