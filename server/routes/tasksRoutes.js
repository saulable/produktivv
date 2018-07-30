const mongoose = require('mongoose');
const express = require('express');
const moment = require('moment');
const _ = require('lodash');
const SimpleTask = mongoose.model('simpleTask');
const DailyJ = mongoose.model('dailyjournals');
const Tracks = mongoose.model('tracks');
const Hats = mongoose.model('hats');
const DailyTaskList = mongoose.model('dailyTaskList');

const repeatFunctions = require('./repeatFunctions');

module.exports = app => {
	app.post('/api/create_task', async (req, res) => {
		const { message, journal, user } = req.body;
		let highestIndex = await SimpleTask.findOne({ _user: user._id })
			.where('created_at')
			.gt(moment().startOf('day'))
			.lt(moment().endOf('day'))
			.sort('-index')
			.exec();
		let newIndex = highestIndex === null ? -1 : highestIndex.index;
		const task = new SimpleTask({
			message,
			journal,
			_user: user._id,
			index: (newIndex += 1),
			created_at: new Date(),
			start_date: moment().toDate(),
			end_date: moment()
				.add(1, 'hours')
				.toDate()
		}
		);
		let highestIndexDaily = await DailyTaskList.findOne(
			{ _user: user._id }
		)
			.where('forDate')
			.gt(moment().startOf('day'))
			.lt(moment().endOf('day'))
			.sort('-index')
			.exec();
		const taskLength = (highestIndexDaily.taskList.length);
		try {
			// taskDailyList.save();
			const saveTask = await task.save();
			highestIndexDaily.taskList.push({
				id: saveTask._id,
				completed: false,
				note: '',
				message,
				journal,
				_user: user._id,
				index: (newIndex += 1),
				created_at: new Date(),
				start_date: moment().toDate(),
				end_date: moment()
					.add(1, 'hours')
					.toDate()
			});
			await DailyTaskList.findOneAndUpdate({_id: highestIndexDaily._id}, {taskList: highestIndexDaily.taskList}).exec();
			res.send(saveTask);
		} catch (err) {
			res.status(422).send(err);
		}
	});
	app.post('/api/update_task_index', (req, res) => {
		// need to find the dailytasklist id, then just insert the new updated array.
		const taskList = req.body.items.map((x, index) => {
			return x._id;
		});
		DailyTaskList.update(
			{ _id: req.body.id },
			{ $set: { indexes: taskList } }
		).exec();
		res.status(200).send({ success: true });
		// req.body.items.map((x, index) => {
		// 	DailyTaskList.update({ _id: x._id }, { $set: { index: index } }).exec();
		// });
		// res.status(200).send({ success: true });
	});
	app.post('/api/daily_tasks', async (req, res) => {
		const dailyTasks = await SimpleTask.find({ _user: req.body._id })
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
		const getNote = await SimpleTask.find({ _id: req.body.id }).exec(
			(err, data) => {
				if (err) res.status(500).send(err);
				res.status(200).send(data);
			}
		);
	});
	app.post('/api/notes_update', async (req, res) => {
		SimpleTask.updateOne(
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
		SimpleTask.updateOne(
			{ _id: req.body.id },
			{ $set: { message: req.body.dataNote } }
		).exec();
		res.send({ draftSaved: true });
	});
	app.post('/api/complete_task', async (req, res) => {
		const taskComplete = await SimpleTask.findById(req.body.id);
		const completed = await SimpleTask.findOneAndUpdate(
			{ _id: req.body.id },
			{ $set: { completed: !taskComplete.completed } },
			{ new: true }
		).exec();
		res.send(completed);
	});
	app.post('/api/delete_task', async (req, res) => {
		try {
			const deleteTask = await SimpleTask.deleteOne({
				_id: req.body.data._id
			}).exec();
			const dailyTasks = await SimpleTask.find({ _user: req.body.user._id })
				.where('start_date')
				.gt(moment().startOf('day'))
				.lt(moment().endOf('day'))
				.sort({ index: 'asc' })
				.exec();
			const newIndexTasks = await dailyTasks.map((x, index) => {
				SimpleTask.findOneAndUpdate(
					{ _id: x._id },
					{ $set: { index: index } }
				).exec();
			});
			const updatedTasks = await SimpleTask.find({ _user: req.body.user._id })
				.where('start_date')
				.gt(moment().startOf('day'))
				.lt(moment().endOf('day'))
				.sort({ index: 'asc' })
				.exec();
			res.status(200).send(updatedTasks);
		} catch (err) {
			res.status(500).json({ err });
		}
	});
};
