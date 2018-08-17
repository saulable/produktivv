const mongoose = require('mongoose');
const express = require('express');
const moment = require('moment');
const _ = require('lodash');
const axios = require('axios');
const SimpleTask = mongoose.model('simpleTask');
const SimpleLongTask = mongoose.model('simpleLongTask');
const RepeatTask = mongoose.model('repeatTask');
const RedueTask = mongoose.model('redueTask');
const DailyJ = mongoose.model('dailyjournals');
const Tracks = mongoose.model('tracks');
const Hats = mongoose.model('hats');
const DailyTaskList = mongoose.model('dailyTaskList');

const repeatFunctions = require('./repeatFunctions');

module.exports = app => {
	app.post('/api/create_task', async (req, res) => {
		const { message, user, date} = req.body;
		let start_date;
		if (moment().endOf('day').diff(moment(), 'minutes') <= 60){
			start_date = moment({hour: 23}).toDate();
		}else {
			start_date = moment().toDate();
		}
		const task = new SimpleTask({
			message,
			_user: user._id,
			created_at: new Date(),
			start_date,
			end_date: moment(start_date)
				.add(1, 'hours')
				.toDate()
		});
		let highestIndexDaily = await DailyTaskList.findOne({ _user: user._id })
			.where('forDate')
			.gte(moment().startOf('day'))
			.lte(moment().endOf('day'))
			.exec();
		if (highestIndexDaily === null){
			highestIndexDaily = {
				taskList: [],
				indexes: [],
			};
		}
		try {
			// taskDailyList.save();
			const saveTask = await task.save();
			highestIndexDaily.taskList.push({
				_id: saveTask._id.toString(),
				completed: false,
				message,
				taskType: 'simple',
				start_date,
				end_date: moment(start_date).add(1, 'hours').toDate()
			});
			if (highestIndexDaily === null) {
				return null;
			}else {
				highestIndexDaily.indexes.push(saveTask._id.toString());
				await DailyTaskList.findOneAndUpdate({_id: highestIndexDaily._id}, {taskList: highestIndexDaily.taskList, indexes: highestIndexDaily.indexes}).exec();
			}
			res.send(saveTask);
		} catch (err) {
			res.status(422).send(err);
		}
	});
	app.post('/api/create_calendar_simpletask', async (req, res) => {
		const { message, user, date} = req.body;
		const start_date = moment(req.body.date).hour(9).toDate();
		const task = new SimpleTask({
			message,
			_user: user._id,
			created_at: new Date(),
			start_date,
			end_date: moment(start_date)
				.add(1, 'hours')
				.toDate()
		});
		const saveTask = await task.save();
		let checkDaily = await DailyTaskList.findOne({ _user: user._id })
			.where('forDate')
			.gte(moment(date).startOf('day'))
			.lte(moment(date).endOf('day'))
			.exec();
		if (checkDaily !== null){
			DailyTaskList.findById(checkDaily._id, (err,doc) => {
				doc.indexes.push(saveTask._id);
				doc.taskList.push(saveTask);
				doc.save();
			});
		}
		res.send(saveTask);

	});
	app.post('/api/update_task_index', async (req, res) => {
		// need to find the dailytasklist id, then just insert the new updated array.
		// await DailyTaskList.findOneAndUpdate({ _user: user._id }, {taskList: todayTasks, forDate: date, indexes: indexTodayTasks}, options)
		const taskList = req.body.items.map((x, index) => {
			return x._id;
		});
		DailyTaskList.findById( req.body.id, (err,doc) => {
			doc.indexes = taskList;
			doc.taskList = req.body.items;
			doc.save();
		});
		res.status(200).send({ success: true });
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
		const {id, tasktype, start_date, curDate, end_date} = req.body;
		const taskComplete = await SimpleTask.findById(id);
		let completed;
		if (tasktype === 'simple'){
			completed = await SimpleTask.findOneAndUpdate(
				{ _id: id },
				{ $set: { completed: !taskComplete.completed } },
				{ new: true }
			).exec();
		} else if( tasktype === 'simplelong'){
			// console.log(moment(curDate));
			const taskStatus = await SimpleLongTask.findById(id);
			if (moment(curDate).isSame(start_date, 'day')){
				if (taskStatus.task_status === 'uncomplete'){
					await SimpleLongTask.findOneAndUpdate( {_id: id}, {$set: {task_status: 'inprogress'} } );
				} else if (taskStatus.task_status === 'inprogress'){
					await SimpleLongTask.findOneAndUpdate({_id: id}, {$set: {task_status: 'uncomplete'} });
				}
			}else if (moment(curDate).isSame(end_date, 'day')){
				if (taskStatus.task_status === 'inprogress'){
					completed = await SimpleLongTask.findOneAndUpdate({_id: id}, {$set: {completed: !taskStatus.completed, task_status: 'completed'}});
				} else if (taskStatus.task_status === 'completed'){
					completed = await SimpleLongTask.findOneAndUpdate({_id: id}, {$set: {completed: !taskStatus.completed, task_status: 'inprogress'}});
				}
			}
		}
		else if (tasktype === 'repeat'){
			const taskComplete = await RepeatTask.findById(id);
			const getStart = new Date(start_date).getTime();
			if (taskComplete.datesCompleted.includes(getStart)){
				completed = await RepeatTask.findOneAndUpdate({ _id: id }, {$pull: { datesCompleted: getStart }}, {new: true}).exec();
			}else {
				completed = await RepeatTask.findOneAndUpdate({ _id: id }, {$push: { datesCompleted: getStart }}, {new: true}).exec();
			}
		}else if (tasktype === 'redue'){
			const taskComplete = await RedueTask.findById(id);
			const getStart = new Date(start_date).getTime();
			if (taskComplete.datesCompleted.includes(getStart)){
				completed = await RedueTask.findOneAndUpdate({ _id: id }, {$pull: { datesCompleted: getStart }, $inc:{totalCompletes: -1}}, {new: true}).exec();
			}else {
				completed = await RedueTask.findOneAndUpdate({ _id: id }, {$push: { datesCompleted: getStart }, $set: {lastCompleted: getStart}, $inc: {totalCompletes: 1}}, {new: true}).exec();
			}
		}
		res.send(completed);
	});
	app.post('/api/delete_task', async (req, res) => {
		const { dailyId, _id } = req.body.data;
		let updatedTasks;
		try {
			const deleteTask = await SimpleTask.deleteOne({
				_id: req.body.data._id
			}).exec();
			if (dailyId !== undefined){
				// updatedTasks = await DailyTaskList.findById(dailyId, (err, doc) => {
				// 	doc.indexes.pull({})
				// });
				updatedTasks = await DailyTaskList.findOneAndUpdate({_id:  dailyId}, {$pull: {indexes: _id, taskList:{_id: _id} } }, {new: true}).exec();
			}else {
				// need to check there is a taskList for that day.

			}
			res.status(200).send(updatedTasks.taskList);
		} catch (err) {
			res.status(500).json({ err });
		}
	});
	app.post('/api/delete_cal_month_task', async (req, res) => {
		const { dailyId, _id } = req.body;
		try {
			const deleteTask = await SimpleTask.deleteOne({
				_id
			}).exec();
			if (dailyId !== undefined){
				await DailyTaskList.findOneAndUpdate({_id:  dailyId}, {$pull: {indexes: _id, taskList:{_id: _id} } }, {new: true}).exec();
			}
		} catch (err) {
			res.status(500).json({ err });
		}
	});
};
