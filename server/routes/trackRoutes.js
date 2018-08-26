const mongoose = require('mongoose');
const express = require('express');

const TrackTree = mongoose.model('trackstree');

module.exports = app => {
	app.post('/api/tracktree_render', async (req, res) => {
		const { _id } = req.body;
		const checkTree = await TrackTree.findOne({ _user: _id }).exec();
		let tree;
		if (checkTree === null) {
			tree = new TrackTree({
				tree: [
					{ title: 'Inbox', key: '0000-key', draggable: false },
					{ title: 'Personal', key: '0001-key' },
					{ title: 'Business', key: '0002-key' },
					{ title: 'Music', key: '0003-key' }
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
	app.post('/api/update/treetree_sort', async (req,res) => {
		const { _id } = req.body.user;
		const checkTree = await TrackTree.findOne({_user: _id}).exec();
		if (checkTree === null){
			res.status(202).send({success:false});
		}else {
			const saveTree= await TrackTree.findOneAndUpdate({_user: _id}, {$set: {tree: req.body.data }});
			res.status(200).send(saveTree);
		}
	});
};
