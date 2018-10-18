/* global process */
const bodyParser = require('body-parser');
const passport = require('passport');
const express = require('express');
const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const keys = require('./config/keys');

const app = express();

let server;
server = http.createServer(app);

mongoose
	.connect(keys.mongoURI, {useNewUrlParser: true})
	.then(() => console.log('connection successful'))
	.catch(err => console.log(err));

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

// Login Routes
require('./routes/facebookRoutes')(app, passport);
// app.use(express.cookieParser());

app.get('/', (req, res) => {
	console.log(123);
});
// Listen up on the port.
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
	console.log('listening... on port' + PORT);
});
