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
		// const ccTasks = [...repeatTasks, ...monthTasks];
		// const monthlyTasks = _.uniqBy(ccTasks, e => {
		// 	return e.id;
		// });
		_.map(
			repeatTasks,
			value => {
				const { timeInterval, activeRepeatRadio, daysSelected, _id, taskDuration } = value;
				if (timeInterval === 'day') {
					switch (activeRepeatRadio) {
					case 'never': {
						const repeatDays = repeatFunctions.dailyRepeatNever(value, date);
						return fullCal.push(...repeatDays);
					}
					case 'on': {
						const repeatDays = repeatFunctions.dailyRepeatEnds(value, date);
						return fullCal.push(...repeatDays);
					}
					case 'after': {
						const repeatDays = repeatFunctions.dailyRepeatCompletes(value, date);
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
							repeatDays = repeatFunctions.weeklyRepeatNeverDays(value, date);
						}
						return fullCal.push(...repeatDays);
					}
					case 'on': {
						const repeatDays = repeatFunctions.weeklyRepeatEnds(value, date);
						return fullCal.push(...repeatDays);
					}
					case 'after': {
						const realOccursDate = moment(value.start_date).add(
							value.afterCompletes,
							'weeks'
						);
						if (
							moment(date)
								.startOf('month')
								.isBefore(realOccursDate)
						) {
							const repeatDays = repeatFunctions.weeklyRepeatCompletes(
								value,
								date
							);
							return fullCal.push(...repeatDays);
						}
					}
					}
				} else if (timeInterval === 'month') {
					switch (activeRepeatRadio) {
					case 'never': {
						const repeatDays = repeatFunctions.monthlyRepeatNever(value, date);
						return fullCal.push(...repeatDays);
					}
					case 'on': {
						const repeatDays = repeatFunctions.monthlyRepeatEnds(value, date);
						return fullCal.push(...repeatDays);
					}
					case 'after': {
						const repeatDays = repeatFunctions.monthlyRepeatCompletes(value, date);
						return fullCal.push(...repeatDays);
					}
					}
				} else if (timeInterval === 'year'){
					switch (activeRepeatRadio) {
					case 'never': {
						const repeatDays = repeatFunctions.yearlyRepeatNever(value);
						return fullCal.push(...repeatDays);
					}
					case 'on': {
						const repeatDays = repeatFunctions.yearlyRepeatEnds(value);
						return fullCal.push(...repeatDays);
					}
					case 'after': {
						const repeatDays = repeatFunctions.yearlyRepeatCompletes(value);
						return fullCal.push(...repeatDays);
					}
					}
				}
				fullCal.push(value);
			},
			date
		);
		res.send(fullCal);
	});

	// The route to create the daily Journal and return it.
	app.post('/api/create_daily_tasks', async (req, res) => {
		const { user, todayTasks, date } = req.body;
		let dailyTasksList, indexTodayTasks;

		let findDaily = await DailyTaskList.findOne({_user: user._id})
			.where('forDate')
			.gt(moment(date).startOf('day'))
			.lt(moment(date).endOf('day'))
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
			.gt(moment(date).startOf('day'))
			.lt(moment(date).endOf('day'))
			.exec((err, doc) => {
				if (err) res.status(401).send({success: false});
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
			activeRepeatRadio,
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
					journal,
					_user: user._id,
					created_at: Date.now(),
					start_date,
					end_date
				});
				break;
			} else {
				task = new SimpleLongTask({
					message,
					journal,
					_user: user._id,
					created_at: Date.now(),
					start_date,
					end_date
				});
				break;
			}
		}
		case 'repeat': {
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
				lastCompleted: null,
				totalCompletes,
				taskDuration,
				taskDurationFormat
			});
			break;
		}
		case 'redue': {
			task = new RedueTask({
				message,
				journal,
				_user: user._id,
				// index: (newIndex += 1),
				created_at: Date.now(),
				start_date,
				end_date: moment(start_date).add(1, 'hours')
			});
			break;
		}
		default:
			break;
		}
		let saveTask = await task.save();
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
