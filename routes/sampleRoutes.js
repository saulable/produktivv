module.exports = app => {
	app.get('/api/book', (req, res) => {
		res.send('you made it');
	});
};
