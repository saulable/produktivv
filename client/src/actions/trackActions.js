import axios from 'axios';
import {
	TRACK_TREE_VIEW,
	UPDATE_TREE_VIEW,
	CREATE_TREE_FOLDER,
	RENAME_TREE_VIEW,
	EDIT_TITLE_VIEW,
	SAVE_TITLE_TREE,
	INIT_TRACK_VIEW,
	TRACKS_CHANGE_TREE_VIEW
} from './types';
import jwtDecode from 'jwt-decode';
import _ from 'lodash';

function userToken() {
	let user;
	if (localStorage.getItem('jwtToken')) {
		user = jwtDecode(localStorage.getItem('jwtToken'));
	}
	return user;
}

export const treeView = data => async dispatch => {
	const user = userToken();
	const res = await axios.post('/api/tracks/tracktree_render', user);
	dispatch({ type: TRACK_TREE_VIEW, payload: res });
};

export const updateTree = data => async dispatch => {
	const user = userToken();
	axios.post('/api/tracks/update_treetree_sort', { user, data });
	dispatch({ type: UPDATE_TREE_VIEW, payload: data });
};
export const newFolder = data => async dispatch => {
	// find the highest key value
	const user = userToken();
	const arrIndexes = [];
	let newTrack = {};
	const dataLoop = data.tree;
	const loop = (data, key, callback) => {
		data.forEach((item, index, arr) => {
			if (item.children) {
				loop(item.children, key, callback);
			}
			if (item.key === key) {
				if (item.children) {
					item.children.push({ key: eventKey, title: 'New Folder' });
					newTrack = { key: eventKey, titlte: 'New Folder' };
					return;
				} else {
					item.children = [];
					item.children.push({ key: eventKey, title: 'New Folder' });
					newTrack = { key: eventKey, titlte: 'New Folder' };
				}
			} else {
				// get all the keys so we can sort and find the highest index.
				const val = item.key.split('-');
				arrIndexes.push({ key: item.key, val: Number(val[0]) });
				return;
			}
		});
	};
	loop(dataLoop);
	const highestVal = arrIndexes.sort((a, b) => {
		return a.val - b.val;
	});
	let num = highestVal[highestVal.length - 1].key.split('-');
	num = Number(num[0]) + 1;
	const eventKey = num + '-key';
	//the folder we clicked on to create it.
	const folderKey = data.info.node.props.eventKey;
	loop(dataLoop, folderKey, eventKey);
	let expandedKeys;
	// if we have expanded keys already.
	if (data.expandedKeys) {
		// if the last key expanded is not equal to the current folder key
		if (data.expandedKeys[data.expandedKeys.length - 1] !== folderKey) {
			expandedKeys = [...data.expandedKeys, folderKey];
		} else {
			expandedKeys = [...data.expandedKeys];
		}
	} else {
		expandedKeys = [eventKey];
	}
	axios.post('/api/tracks/create_new_folder', {
		user,
		dataLoop,
		newTrack,
		eventKey
	});
	dispatch({
		type: CREATE_TREE_FOLDER,
		payload: { dataLoop, eventKey, folderKey, expandedKeys }
	});
	return;
};
export const renameFolder = data => async dispatch => {
	const arrIndexes = [];
	let dataLoop = data.tree;
	const key = data.key;
	const loop = (data, key, callback) => {
		data.forEach((item, index, arr) => {
			if (item.children) {
				loop(item.children, key, callback);
			}
			if (item.key === key) {
				// console.log(item.title);
				item.editable = true;
				return;
			}
		});
	};
	loop(dataLoop, key);
	dispatch({ type: RENAME_TREE_VIEW, payload: { tree: dataLoop, key } });
};

export const editTitle = data => async dispatch => {
	let dataLoop = data.tree;
	const valueText = data.value;
	const loop = (data, key, callback) => {
		data.forEach((item, index, arr) => {
			if (item.children) {
				loop(item.children, key, callback);
			}
			if (item.editable === true) {
				item.title = valueText;
				return;
			}
		});
	};
	loop(dataLoop);
	dispatch({ type: EDIT_TITLE_VIEW, payload: dataLoop });
};

export const saveTitle = data => async dispatch => {
	const user = userToken();
	let dataLoop = data.tree;
	const dataKey = data.key;
	const arrIndexes = [];
	const loop = (data, key, callback) => {
		data.forEach((item, index, arr) => {
			if (item.children) {
				loop(item.children, key, callback);
			}
			if (item.key === dataKey) {
				item.editable = false;
				arrIndexes.push(item);
				return;
			}
		});
	};
	loop(dataLoop);
	axios.post('/api/tracks/savetree', {
		user,
		dataLoop,
		dataKey,
		item: arrIndexes[0]
	});
	dispatch({ type: SAVE_TITLE_TREE, payload: { data: dataLoop, key: null } });
};
export const deleteFolder = data => async dispatch => {
	const user = userToken();
	let dataLoop = data.tree;
	let dataKey = data.info.node.props.eventKey;
	const loop = (data, key, callback) => {
		data.forEach((item, index, arr) => {
			if (item.children) {
				loop(item.children, key, callback);
			}
			if (item.key === key) {
				arr.splice(index, 1);
				return;
			}
		});
	};
	loop(dataLoop, dataKey);
	axios.post('/api/tracks/delete_folder', { user, dataLoop });
	dispatch({ type: EDIT_TITLE_VIEW, payload: dataLoop });
};
export const initTrackView = data => async dispatch => {
	const user = userToken();
	let key;
	if (data){
		key = data.key;
	}else {
		key = '0-key';
	}
	const res = await axios.post('/api/tracks/init_trackview', {user, key});
	console.log(res);
	dispatch({ type: INIT_TRACK_VIEW, payload: res });
};
export const onSelectTree = data => async dispatch => {
	const user = userToken();
	const folderKey = data.key;
	const rootKeys = data.tree.pos.split('-');
	let keysOfTree = [];
	if (rootKeys.length > 2) {
		keysOfTree.push(folderKey);
	}
	const dataLoop = data.tree;
	const loop = (data, key, callback) => {
		for (let i = 0; i < data.length; i++) {
			if (data) {
				keysOfTree.push(data[i].key);
			}
			if (data[i].props.children) {
				loop(data[i].props.children, key);
			}
		}
	};
	if (dataLoop.children) {
		loop(dataLoop.children, folderKey);
	} else {
		keysOfTree.push(dataLoop.eventKey);
	}
	const keys = [...new Set(keysOfTree)];
	const res = await axios.post('/api/tracks/retrieve_tasks', { keys, user });
	initTrackView(folderKey);
};


export const hotSpotChange = (type, value) => async dispatch => {
	return dispatch({ type: TRACKS_CHANGE_TREE_VIEW, payload: {type, value}});
};
