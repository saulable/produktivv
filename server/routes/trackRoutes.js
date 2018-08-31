const mongoose = require('mongoose');
const express = require('express');

const TrackTree = mongoose.model('trackstree');
const Tracks = mongoose.model('tracks');

module.exports = app => {
	app.post('/api/tracks/tracktree_render', async (req, res) => {
		const { _id } = req.body;
		const checkTree = await TrackTree.findOne({ _user: _id }).exec();
		let tree;
		if (checkTree === null) {
			tree = new TrackTree({
				tree: [
					{ title: 'Inbox', key: '0-key', draggable: false },
					{ title: 'Personal', key: '1-key' },
					{ title: 'Business', key: '2-key' },
					{ title: 'Music', key: '3-key' }
				],
				_user: _id,
				created_at: Date.now()
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
		const loop = (data, key, callback) => {
			data.forEach((item, index, arr) => {
				if (item.children) {
					loop(item.children, key, callback);
				}
				if (item.key === key) {
					item.id = saveTrack._id;
					return;
				}
			});
			return data;
		};
		const newTreeWithId = await loop(dataLoop, eventKey);
		const saveTree= await TrackTree.findOneAndUpdate({_user: _id}, {$set: {tree: newTreeWithId} } );
		res.status(200).send(saveTree);
	});
	app.post('/api/tracks/savetree', async (req,res) => {
		const { _id } = req.body.user;
		const data = req.body.dataLoop;
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
		const checkTree = await TrackTree.findOne({_user: _id}).exec();
		if (checkTree === null){
			res.status(202).send({success:false});
		}else {
			const saveTree= await TrackTree.findOneAndUpdate({_user: _id}, {$set: {tree: data }});
			res.status(200).send(saveTree);
		}
	});
	app.post('/api/tracks/delete_folder', async (req,res) => {
		const {_id} = req.body.user;
		const saveTree= await TrackTree.findOneAndUpdate({_user: _id}, {$set: {tree: req.body.dataLoop} } );
		res.status(200).send(saveTree);
	});
};
