const mongoose = require('mongoose');
const express = require('express');
const moment = require('moment');
const _ = require('lodash');
const Tasks = mongoose.model('tasks');
const DailyJ = mongoose.model('dailyjournals');
const Tracks = mongoose.model('tracks');
const Hats = mongoose.model('hats');

const repeatFunctions = require('./repeatFunctions');

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
		res.status(200).send({success:true});
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
	app.post('/api/task_retrieve', async (req, res) => {
		const getNote = await Tasks.find({ _id: req.body.id }).exec((err, data)=> {
			if (err) res.status(500).send(err);
			res.status(200).send(data);
		});
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
	app.post('/api/delete_task', async (req, res) => {
		try {
			const deleteTask = await Tasks.deleteOne({
				_id: req.body.data._id
			}).exec();
			const dailyTasks = await Tasks.find({ _user: req.body.user._id })
				.where('start_date')
				.gt(moment().startOf('day'))
				.lt(moment().endOf('day'))
				.sort({index: 'asc'})
				.exec();
			const newIndexTasks = await dailyTasks.map((x, index) => {
				Tasks.findOneAndUpdate(
					{ _id: x._id },
					{ $set: { index: index } }
				).exec();
			});
			const updatedTasks = await Tasks.find({ _user: req.body.user._id })
				.where('start_date')
				.gt(moment().startOf('day'))
				.lt(moment().endOf('day'))
				.sort({index: 'asc'})
				.exec();
			res.status(200).send(updatedTasks);
		} catch (err) {
			res.status(500).json({ err });
		}
	});
	app.post('/api/init_cal', async (req, res) => {
		const { date, user } = req.body;
		const monthTasks = await Tasks.find({ _user: user._id })
			.where('start_date')
			.gt(moment(date).startOf('month'))
			.lt(moment(date).endOf('month'));
		const repeatTasks = await Tasks.find({ _user: user._id, repeat: true });
		const ccTasks = [...repeatTasks, ...monthTasks];
		const monthlyTasks = _.uniqBy(ccTasks, e => {
			return e.id;
		});
		let fullCal = [];
		_.map(
			monthlyTasks,
			value => {
				const { repeat, timeInterval, activeRepeatRadio, daysSelected } = value;
				if (repeat) {
					if (timeInterval === 'day') {
						switch (activeRepeatRadio) {
						case 'never': {
							const repeatDays = repeatFunctions.dailyRepeatNever(
								value,
								date
							);
							return fullCal.push(...repeatDays);
						}
						case 'on': {
							const repeatDays = repeatFunctions.dailyRepeatEnds(value);
							return fullCal.push(...repeatDays);
						}
						case 'after': {
							const repeatDays = repeatFunctions.dailyRepeatCompletes(value);
							return fullCal.push(...repeatDays);
						}
						}
					} else if (timeInterval === 'week') {
						switch (activeRepeatRadio) {
						case 'never': {
							let repeatDays;
							if (daysSelected.length === 0) {
								repeatDays = repeatFunctions.weeklyRepeatNever(value, date);
							} else {
								repeatDays = repeatFunctions.weeklyRepeatNeverDays(
									value,
									date
								);
							}
							return fullCal.push(...repeatDays);
						}
						case 'on': {
							const repeatDays = repeatFunctions.weeklyRepeatEnds(
								value,
								date
							);
							return fullCal.push(...repeatDays);
						}
						case 'after': {
							const repeatDays = repeatFunctions.weeklyRepeatCompletes(
								value,
								date
							);
							return fullCal.push(...repeatDays);
						}
						}
					} else if (timeInterval === 'month') {
						switch (activeRepeatRadio) {
						case 'never': {
							const repeatDays = repeatFunctions.monthlyRepeatNever(value);
							return fullCal.push(...repeatDays);
						}
						case 'on': {
							const repeatDays = repeatFunctions.monthlyRepeatEnds(value);
							return fullCal.push(...repeatDays);
						}
						case 'after': {
							const repeatDays = repeatFunctions.monthlyRepeatCompletes(
								value
							);
							return fullCal.push(...repeatDays);
						}
						}
					}
				}
				fullCal.push(value);
			},
			date
		);
		res.send(fullCal);
	});

	app.post('/api/create_calendar_task', async (req, res) => {
		let {
			message,
			journal,
			user,
			start_date,
			end_date,
			track,
			hat,
			timeInterval,
			timePlural,
			repeatTime,
			activeRepeatRadio,
			afterCompletes,
			endsOnDate,
			daysSelected,
			monthlyRepeat
		} = req.body;
		let { switchRepeats, nthdayMonth } = req.body.rdxStore;
		timePlural ? (timeInterval = timeInterval.slice(0, -1)) : timeInterval;
		// moment("10/15/2014 9:00", "M/D/YYYY H:mm")
		start_date = moment(start_date, 'MMMM Do YYYY, h:mm').toDate();
		end_date = moment(end_date, 'MMMM Do YYYY, h:mm').toDate();
		// first we find the task with the lowest index for that day.
		let highestIndex = await Tasks.findOne({ _user: user._id })
			.where('created_at')
			.gt(moment(start_date).startOf('day'))
			.lt(moment(end_date).endOf('day'))
			.sort('-index')
			.exec();
		let newIndex = highestIndex === null ? -1 : highestIndex.index;
		let task;
		if (switchRepeats === null) {
			task = new Tasks({
				message,
				journal,
				_user: user._id,
				index: (newIndex += 1),
				created_at: Date.now(),
				start_date,
				end_date: moment(start_date).add(1, 'hours')
			});
		} else if (switchRepeats === 'repeat') {
			task = new Tasks({
				message,
				journal,
				_user: user._id,
				index: (newIndex += 1),
				created_at: Date.now(),
				start_date,
				end_date: moment(start_date).add(1, 'hours'),
				repeat: true,
				repeatTime,
				timeInterval,
				daysSelected,
				nthdayMonth,
				monthlyRepeat,
				activeRepeatRadio,
				endsOnDate,
				afterCompletes,
				lastCompleted: null,
				totalCompletes: 0
			});
		} else if (switchRepeats === 'redue') {
			task = new Tasks({
				message,
				journal,
				_user: user._id,
				index: (newIndex += 1),
				created_at: Date.now(),
				start_date,
				end_date: moment(start_date).add(1, 'hours')
			});
		}
		const saveTask = await task.save();
		if (track === '') {
			await Tracks.update(
				{
					$and: [{ _user: user._id }, { name: 'inbox' }]
				},
				{
					name: 'inbox',
					created_at: Date.now(),
					$push: { tasks: saveTask.id },
					_user: user._id
				},
				{ upsert: true }
			).exec();
		} else {
			await Tracks.update(
				{
					$and: [{ _user: user._id }, { name: track }]
				},
				{
					name: track,
					created_at: Date.now(),
					$push: { tasks: saveTask.id },
					_user: user._id
				},
				{ upsert: true }
			).exec();
		}
		if (hat === '') {
			await Hats.update(
				{
					$and: [{ _user: user._id }, { name: 'No Hat' }]
				},
				{
					name: 'No Hat',
					created_at: Date.now(),
					$push: { tasks: saveTask.id },
					_user: user._id
				},
				{ upsert: true }
			).exec();
		} else {
			await Hats.update(
				{
					$and: [{ _user: user._id }, { name: hat }]
				},
				{
					name: hat,
					created_at: Date.now(),
					$push: { tasks: saveTask.id },
					_user: user._id
				},
				{ upsert: true }
			).exec();
		}

		res.send(saveTask);
	});
	app.post('/api/create_track', async (req, res) => {});
};
