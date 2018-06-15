const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs');
const pug = require('pug');


module.exports = app => {
	app.get('/', (req, res)=>{
		res.render('homepage');
	});
};
