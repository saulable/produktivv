const mongoose = require('mongoose');
const express = require('express');
const moment = require('moment');
const _ = require('lodash');

const SimpleTask = mongoose.model('simpleTask');
const SimpleLongTask = mongoose.model('simpleLongTask');
const DailyJ = mongoose.model('dailyjournals');
const Tracks = mongoose.model('tracks');
const Hats = mongoose.model('hats');
const DailyTaskList = mongoose.model('dailyTaskList');
const RepeatTask = mongoose.model('repeatTask');
const RedueTask = mongoose.model('redueTask');

const retrieve = require('./repeatRetrieve');
const repeatFunctions = require('./repeatFunctions');

function mapOrder(array, order, key) {
	array.sort(function(a, b) {
		var A = a[key],
			B = b[key];
		if (order.indexOf(A) > order.indexOf(B)) {
			return 1;
		} else {
			return -1;
		}
	});
	return array;
}

module.exports = app => {
	app.post('/api/init_cal', async (req, res) => {
		const { date, user } = req.body;
		let fullCal = [];
		const monthTasks = await SimpleTask.find({ _user: user._id })
			.where('start_date')
			.gt(moment(date).startOf('month'))
			.lt(moment(date).endOf('month'));
		const monthDurationTasks = await SimpleLongTask.find({_user: user._id});
		monthDurationTasks.filter((x) => {
			if (moment(date).isBetween(moment(x.start_date).startOf('month'), moment(x.end_date).endOf('month'))){
				return x;
			}
		});
		fullCal.push(...monthTasks, ...monthDurationTasks);
		const repeatTasks = await RepeatTask.find({
			_user: user._id
		});
		const sortedTasks = retrieve.repeats(repeatTasks, fullCal, date );
		const redueTasks = await RedueTask.find({
			_user: user._id
		});
		if (redueTasks.length !== 0){
			const sortedRedueTasks = retrieve.redues(redueTasks, fullCal, date );
		}
		res.send(fullCal);
	});

	// The route to create the daily Journal and return it.
	app.post('/api/create_daily_tasks', async (req, res) => {
		const { user, todayTasks, date } = req.body;
		let dailyTasksList, indexTodayTasks;
		let findDaily = await DailyTaskList.findOne({_user: user._id})
			.where('forDate')
			.gte(moment(date).startOf('day'))
			.lte(moment(date).endOf('day'))
			.exec();
		// if there is no DailyTaskList, we create one.
		if (findDaily === null){
			dailyTasksList = todayTasks.sort((a, b) => {
				return new Date(a.start_date) - new Date(b.start_date);
			}).map((val, index)=> {
				val.index = index;
				return val;
			});
			indexTodayTasks = todayTasks.map((val, index) => {
				return val._id;
			});
		} else {
			// Sort current tasks by their ids
			dailyTasksList = _.sortBy(todayTasks, (item)=> {
				return findDaily.indexes.indexOf(item._id);
			});
			indexTodayTasks = dailyTasksList.map((val, index)=> {
				return val._id;
			});
		}
		const options = { upsert: true, new: true, setDefaultsOnInsert: true };
		await DailyTaskList.findOneAndUpdate({ _user: user._id }, {taskList: dailyTasksList, forDate: date, indexes: indexTodayTasks}, options)
			.where('forDate')
			.gte(moment(date).startOf('day'))
			.lte(moment(date).endOf('day'))
			.exec((err, doc) => {
				if (err) res.status(401).send({success: false});
				res.status(200).send(doc);
			});
	});
	app.post('/api/update_daily_calendar_tasks', async (req, res) => {
		// we are creating a daily list here.
		const { user, todayTasks, date } = req.body;
		// if there is no DailyTaskList, we create one.
		const indexTodayTasks = todayTasks.map((val, index) => {
			return val._id;
		});
		const options = { upsert: true, new: true, setDefaultsOnInsert: true };
		await DailyTaskList.findOneAndUpdate({ _user: user._id }, {taskList: todayTasks, forDate: date, indexes: indexTodayTasks}, options)
			.where('forDate')
			.gt(moment(date).startOf('day'))
			.lt(moment(date).endOf('day'))
			.exec((err, doc) => {
				if (err) res.status(401).send({success: false});
				res.status(200).send(doc);
			});
	});
	app.post('/api/check_daily_tasks', async(req,res) => {
		const { user, date } = req.body;
		let findDaily = await DailyTaskList.findOne({_user: user._id})
			.where('forDate')
			.gte(moment(date).startOf('day'))
			.lte(moment(date).endOf('day'))
			.exec((err, doc)=> {
				if (err) res.status(202).send(err);
				res.status(200).send(doc);
			});
	});
	app.post('/api/create_calendar_task', async (req, res) => {
		let { message, user } = req.body;
		let {
			journal,
			track,
			hat,
			startDate,
			endDate,
			timeInterval,
			timePlural,
			repeatTime,
			redueTime,
			activeRepeatRadio,
			activeRedueRadio,
			afterCompletes,
			endsOnDate,
			daysSelected,
			monthlyRepeatswitchRepeats,
			nthdayMonth,
			switchRepeats,
			monthChoice,
			totalCompletes,
			rptDisabled,
			taskDuration,
			taskDurationFormat,
		} = req.body.rdxStore;
		timePlural ? (timeInterval = timeInterval.slice(0, -1)) : timeInterval;
		// moment("10/15/2014 9:00", "M/D/YYYY H:mm")
		let start_date = startDate;
		let end_date = endDate;
		// first we find the task with the lowest index for that day and then we add this to the index prop.
		let task;
		switch (switchRepeats) {
		case null: {
			if (moment(startDate).isSame(moment(endDate), 'day')){
				task = new SimpleTask({
					message,
					_user: user._id,
					created_at: Date.now(),
					start_date,
					end_date,
					task_status: 'uncomplete'
				});
				break;
			} else {
				task = new SimpleLongTask({
					message,
					_user: user._id,
					created_at: Date.now(),
					start_date,
					end_date,
					task_status: 'uncomplete'
				});
				break;
			}
		}
		case 'repeat': {
			if (timeInterval === 'day'){
				task = new RepeatTask({
					message,
					_user: user._id,
					created_at: Date.now(),
					start_date,
					end_date,
					repeatTime,
					timeInterval,
					activeRepeatRadio,
					endsOnDate,
					afterCompletes,
					taskDuration,
					taskDurationFormat
				});
			}
			if (timeInterval === 'week'){
				task = new RepeatTask({
					message,
					journal,
					_user: user._id,
					created_at: Date.now(),
					start_date,
					end_date,
					repeatTime,
					timeInterval,
					daysSelected,
					activeRepeatRadio,
					endsOnDate,
					afterCompletes,
					taskDuration
				});
			}
			else {
				task = new RepeatTask({
					message,
					journal,
					_user: user._id,
					created_at: Date.now(),
					start_date,
					end_date,
					repeatTime,
					timeInterval,
					daysSelected,
					nthdayMonth,
					monthChoice,
					activeRepeatRadio,
					endsOnDate,
					afterCompletes,
					totalCompletes,
					taskDuration,
					taskDurationFormat
				});
			}
			break;
		}
		case 'redue': {
			task = new RedueTask({
				message,
				journal,
				created_at: Date.now(),
				start_date,
				end_date,
				_user: user._id,
				timeInterval,
				repeatTime,
				activeRedueRadio,
				endsOnDate,
				afterCompletes
				// index: (newIndex += 1),
			});
			break;
		}
		default:
			break;
		}
		let saveTask = await task.save();
		DailyTaskList.findOneAndUpdate({ _user: user._id }, {$push: {indexes: saveTask._id.toString()}})
			.where('forDate')
			.gt(moment().startOf('day'))
			.lt(moment().endOf('day'))
			.exec();
		// TODO needs to be refactored at some point.
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
		res.status(200).send(saveTask);
	});
	app.post('api/create_repeat_task', async (req, res) => {});
	app.post('/api/create_track', async (req, res) => {});
};
