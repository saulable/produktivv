const mongoose = require('mongoose');
const express = require('express');
const moment = require('moment');

const Tasks = mongoose.model('tasks');
const DailyJ = mongoose.model('dailyjournals');
const Tracks = mongoose.model('tracks');
const Hats = mongoose.model('hats');

module.exports = app => {
	app.post('/api/create_task', async (req, res) => {
		const { message, journal, user } = req.body;
		let highestIndex = await Tasks.findOne({ _user: user._id })
			.where('created_at')
			.gt(moment().startOf('day'))
			.lt(moment().endOf('day'))
			.sort('-index')
			.exec();
		let newIndex = highestIndex === null ? -1 : highestIndex.index;
		const task = new Tasks({
			message,
			journal,
			_user: user._id,
			index: (newIndex += 1),
			created_at: Date.now(),
			start_date: moment().toDate(),
			end_date: moment()
				.add(5, 'minutes')
				.toDate()
		});
		try {
			const saveTask = await task.save();
			res.send(saveTask);
		} catch (err) {
			res.status(422).send(err);
		}
	});
	app.post('/api/update_task_index', (req, res) => {
		req.body.items.map((x, index) => {
			Tasks.update({ _id: x._id }, { $set: { index: index } }).exec();
		});
	});

	app.post('/api/daily_tasks', async (req, res) => {
		const dailyTasks = await Tasks.find({ _user: req.body._id })
			.where('start_date')
			.gt(moment().startOf('day'))
			.lt(moment().endOf('day'));
		res.send(dailyTasks);
	});
	app.post('/api/daily_journal', async (req, res) => {
		const dailyJournal = await DailyJ.find({ _user: req.body._id })
			.where('created_at')
			.gt(moment().startOf('day'))
			.lt(moment().endOf('day'));
		if (dailyJournal.length === 0) {
			const newJ = new DailyJ({
				message: '',
				created_at: Date.now(),
				_user: req.body._id
			});
			try {
				const saveJournal = await newJ.save();
				res.send(saveJournal);
			} catch (err) {
				res.status(422).send(err);
			}
		} else {
			res.send(dailyJournal);
		}
	});
	app.post('/api/notes_retrieve', async (req, res) => {
		const getNote = await Tasks.find({ _id: req.body.id }).select('note');
		res.send(getNote[0]);
	});
	app.post('/api/notes_update', async (req, res) => {
		Tasks.updateOne(
			{ _id: req.body.id },
			{ $set: { note: req.body.dataNote } }
		).exec();
		res.send({ draftSaved: true });
	});
	app.post('/api/journal_update', async (req, res) => {
		DailyJ.updateOne(
			{ _id: req.body.id },
			{ $set: { message: req.body.dataNote } }
		).exec();
		res.send({ success: true });
	});
	app.post('/api/task_update', async (req, res) => {
		Tasks.updateOne(
			{ _id: req.body.id },
			{ $set: { message: req.body.dataNote } }
		).exec();
		res.send({ draftSaved: true });
	});
	app.post('/api/complete_task', async (req, res) => {
		const taskComplete = await Tasks.findById(req.body.id);
		const completed = await Tasks.findOneAndUpdate(
			{ _id: req.body.id },
			{ $set: { completed: !taskComplete.completed } },
			{ new: true }
		).exec();
		res.send(completed);
	});
	app.post('/api/init_cal', async (req, res) => {
		const dailyTasks = await Tasks.find({ _user: req.body._id });
		res.send(dailyTasks);
	});
	app.post('/api/create_calendar_task', async (req, res) => {
		// console.log(req.body);
		let { message, journal, user, start_date, end_date, track, hat } = req.body;
		// moment("10/15/2014 9:00", "M/D/YYYY H:mm")
		start_date = moment(start_date, 'MMMM Do YYYY, h:mm').toDate();
		end_date = moment(end_date, 'MMMM Do YYYY, h:mm').toDate();
		let highestIndex = await Tasks.findOne({ _user: user._id })
			.where('created_at')
			.gt(moment(start_date).startOf('day'))
			.lt(moment(end_date).endOf('day'))
			.sort('-index')
			.exec();
		let newIndex = highestIndex === null ? -1 : highestIndex.index;
		const task = new Tasks({
			message,
			journal,
			_user: user._id,
			index: (newIndex += 1),
			created_at: Date.now(),
			start_date,
			end_date: moment(start_date).add(5, 'minutes')
		});
		// done with saving tasks to tasks db
		const saveTask = await task.save();
		// now time to insert to the tracks / hats db.
		// if blank we insert to the inbox.
		if (track === '') {
			await Tracks.update({
				$and: [{ _user: user._id }, { name: 'inbox'}]
			},
			{
				name: 'inbox',
				created_at: Date.now(),
				$push : { tasks: saveTask.id},
				_user: user._id
			},
			{upsert: true}
			).exec();
		}else {
			await Tracks.update({
				$and: [{ _user: user._id }, { name: track}]
			},
			{
				name: track,
				created_at: Date.now(),
				$push : { tasks: saveTask.id},
				_user: user._id
			},
			{upsert: true}
			).exec();
		}
		if (hat === '') {
			await Hats.update({
				$and: [{ _user: user._id }, { name: 'No Hat'}]
			},
			{
				name: 'No Hat',
				created_at: Date.now(),
				$push : { tasks: saveTask.id},
				_user: user._id
			},
			{upsert: true}
			).exec();
		}else {
			await Hats.update({
				$and: [{ _user: user._id }, { name: hat}]
			},
			{
				name: hat,
				created_at: Date.now(),
				$push : { tasks: saveTask.id},
				_user: user._id
			},
			{upsert: true}
			).exec();
		}

		res.send(saveTask);
	});
	app.post('/api/create_track', async (req, res) => {});
};
