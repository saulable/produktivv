const mongoose = require('mongoose');
const express = require('express');

const TrackTree = mongoose.model('trackstree');
const Tracks = mongoose.model('tracks');
const Hats = mongoose.model('hats');
const SimpleTask = mongoose.model('simpleTask');
const SimpleLongTask = mongoose.model('simpleLongTask');
const RepeatTask = mongoose.model('repeatTask');
const RedueTask = mongoose.model('redueTask');

module.exports = app => {
	app.post('/api/tracks/tracktree_render', async (req, res) => {
		const { _id } = req.body;
		const checkTree = await TrackTree.findOne({ _user: _id }).exec();
		let tree, trackInit;
		const arrFields =  [
			{ title: 'Inbox', key: '0-key', draggable: false },
			{ title: 'Personal', key: '1-key' },
			{ title: 'Business', key: '2-key' }
		];
		if (checkTree === null) {
			tree = new TrackTree({
				tree: arrFields,
				_user: _id,
				created_at: Date.now()
			});
			arrFields.map((x) => {
				trackInit = new Tracks({
					title: x.title,
					key: x.key,
					_user: _id
				});
				trackInit.save();
			});
			let saveTree = await tree.save();
			res.status(200).send(saveTree);
		} else {
			res.status(200).send(checkTree);
		}
	});
	app.post('/api/tracks/update_treetree_sort', async (req,res) => {
		const { _id } = req.body.user;
		const checkTree = await TrackTree.findOne({_user: _id}).exec();
		if (checkTree === null){
			res.status(202).send({success:false});
		}else {
			const saveTree= await TrackTree.findOneAndUpdate({_user: _id}, {$set: {tree: req.body.data }});
			res.status(200).send(saveTree);
		}
	});
	app.post('/api/tracks/create_new_folder', async (req,res) => {
		const {eventKey, newTrack, dataLoop} = req.body;
		const {_id} = req.body.user;
		const options = {upsert: true, new: true};
		const setOptions = {tasks: [], name: 'New Folder', key: eventKey};
		const saveTrack = await Tracks.findOneAndUpdate({_user: _id, key: eventKey}, {$set: setOptions } ,options);
		const saveTree= await TrackTree.findOneAndUpdate({_user: _id}, {$set: {tree: dataLoop} }, options);
		res.status(200).send(saveTree);
	});

	app.post('/api/tracks/savetree', async (req,res) => {
		const { _id } = req.body.user;
		const data = req.body.dataLoop;
		const {dataKey, item} = req.body;
		const loop = (data, key, callback) => {
			data.forEach((item, index, arr) => {
				if (item.children) {
					loop(item.children, key, callback);
				}
				if ('editable' in item) {
					delete item.editable;
					return;
				}
			});
		};
		loop(data);
		const options = {upsert: true, new: true};
		const saveTrack = await Tracks.findOneAndUpdate({_user: _id, key: dataKey}, {$set: {title: item.title}}, options);
		const saveTree= await TrackTree.findOneAndUpdate({_user: _id}, {$set: {tree: data }}, options);
		res.status(200).send(saveTree);
	});
	app.post('/api/tracks/delete_folder', async (req,res) => {
		const {_id} = req.body.user;
		const saveTree= await TrackTree.findOneAndUpdate({_user: _id}, {$set: {tree: req.body.dataLoop} } );
		res.status(200).send(saveTree);
	});

	app.post('/api/tracks/retrieve_tasks', async (req, res) => {
		const {_id} = req.body.user;
		const {keys} = req.body;
		const trackQuery = await Tracks.find({ _user: _id, key: {$in: keys} }).exec();
		// console.log(trackQuery);
	});
	app.post('/api/tracks/get_track_names', async(req, res) => {
		const {_id} = req.body;
		const trackQuery = await Tracks.find({ _user: _id}).exec();
		const filtered = trackQuery.map((x) => {
			return {id: x._id, key: x.key, name: x.title};
		});
		if (trackQuery !== null){
			res.status(200).send(filtered);
		}else {
			res.status(202).send({success:false});
		}
	});
	const simpleTaskRetrieve = (id) =>{
		const taskTypes = ['simple_tasks', 'hats', 'redue_tasks', 'repeat_tasks', 'simple_long_tasks'];
		const indexOf = taskTypes.indexOf(id.taskType);
		console.log(id);
		if (indexOf >= 0){
			if (indexOf === 0){
				// task type is simple
				console.log(id.message);
			}
		}
		// const findIndex = await T

	};
	app.post('/api/tracks/init_trackview', async (req,res) => {
		const {_id} = req.body.user;
		const key = req.body.key;
		const trackQuery = await Tracks.find({_user: _id, key:key}).exec();
		// If the treeData has been set, just render this.]
		const dataLoop = trackQuery[0].treeData;
		const allIds = [];
		const allItems = [];
		if (dataLoop){
			// We need to check first, that all tasks are updated.
			const loop = (data, key, callback) => {
				data.forEach((item, index, arr) => {
					if (item.children) {
						loop(item.children, key, callback);
					}
					switch (item.tasktype){
					case 'simple': {
						const task = simpleTaskRetrieve(item.id);
						// iterate over the task and set all the details from the taskRetrieve to the item in the tracks_collection.
						break;
					}
					default:
						break;
					}
				});
			};
			loop(dataLoop, key);
			res.status(200).send({ allTasks: dataLoop, key: trackQuery[0].key, projectHeader: trackQuery[0].title, treeData: true});
		}else {
		// Else we retrieve all tasks.
			const indexTasks = [];
			const simpleTasks = [], simpleLongTasks = [], repeatTasks = [], redueTasks = [];
			trackQuery[0].tasks.map((x, index) => {
				indexTasks.push({id: x.id, taskType: x.taskType, index: index});
				switch (x.taskType){
				case 'simple':
					simpleTasks.push(x.id);
					break;
				case 'simplelong':
					simpleLongTasks.push(x.id);
					break;
				case 'repeat':
					repeatTasks.push(x.id);
					break;
				case 'redue':
					redueTasks.push(x.id);
					break;
				}
			});
			const simpleTasksDB = await SimpleTask.find({_user: _id, _id: {$in: simpleTasks}});
			const simpleLongTaskDB = await SimpleLongTask.find({_user: _id, _id: {$in: simpleLongTasks}});
			const repeatTasksDB = await RepeatTask.find({_user: _id, _id:{$in: repeatTasks}});
			const redueTasksDB = await RedueTask.find({_user: _id, _id:{$in: redueTasks}});
			let allTasks = [...simpleTasksDB, ...simpleLongTaskDB, ...repeatTasksDB, ...redueTasksDB ];
			res.send({allTasks, projectHeader: trackQuery[0].title, key});
		}
	});
	app.post('/api/tracks/init_trackview_hats', async (req,res) => {
		const {_id} = req.body;
		const trackQuery = await Hats.find({_user: _id, title: 'Inbox'}).exec();
		const indexTasks = [];
		const simpleTasks = [], simpleLongTasks = [], repeatTasks = [], redueTasks = [];
		trackQuery[0].tasks.map((x, index) => {
			indexTasks.push({id: x.id, taskType: x.taskType, index: index});
			switch (x.taskType){
			case 'simple':
				simpleTasks.push(x.id);
				break;
			case 'simplelong':
				simpleLongTasks.push(x.id);
				break;
			case 'repeat':
				repeatTasks.push(x.id);
				break;
			case 'redue':
				redueTasks.push(x.id);
				break;
			}
		});
		const simpleTasksDB = await SimpleTask.find({_user: _id, _id: {$in: simpleTasks}});
		const simpleLongTaskDB = await SimpleLongTask.find({_user: _id, _id: {$in: simpleLongTasks}});
		const repeatTasksDB = await RepeatTask.find({_user: _id, _id:{$in: repeatTasks}});
		const redueTasksDB = await RedueTask.find({_user: _id, _id:{$in: redueTasks}});
		let allTasks = [...simpleTasksDB, ...simpleLongTaskDB, ...repeatTasksDB, ...redueTasksDB ];
		res.send(allTasks);
	});
	app.post('/api/tracks_update_treedata', async(req,res) => {
		const {_id} = req.body.user;
		const {treeData, key} = req.body.data;
		const options = {upsert: true, new: true};
		const trackQuery = await Tracks.findOneAndUpdate({_user: _id, key}, {$set: {treeData : treeData} }, options );
		// console.log(trackQuery);
		res.status(200).send({success: true});
	});
	app.post('/api/tracks_push_treedata', async(req,res) => {
		const {_id} = req.body.user;
		const {treeData, id} = req.body.data;
		const options = {upsert: true, new: true};
		const trackQuery = await Tracks.findOneAndUpdate({_id: id}, {$push: {treeData : treeData} }, options );
		// console.log(trackQuery);
		res.status(200).send({success: true});
	});
};
