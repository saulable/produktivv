import axios from 'axios';
import {TRACK_TREE_VIEW, UPDATE_TREE_VIEW, CREATE_TREE_FOLDER, RENAME_TREE_VIEW, EDIT_TITLE_VIEW, SAVE_TITLE_TREE} from './types';
import jwtDecode from 'jwt-decode';

function userToken(){
	let user;
	if (localStorage.getItem('jwtToken')) {
		user = jwtDecode(localStorage.getItem('jwtToken'));
	}
	return user;
}

export const treeView = data => async dispatch => {
	const user = userToken();
	const res = await axios.post('/api/tracks/tracktree_render', user);
	dispatch({type: TRACK_TREE_VIEW, payload: res});
};

export const updateTree = data => async dispatch => {
	const user = userToken();
	axios.post('/api/tracks/update_treetree_sort', {user, data});
	dispatch({type: UPDATE_TREE_VIEW, payload: data});
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
			if (item.key) {
				if (item.key === key){
					if (item.children){
						item.children.push({key: eventKey, title: 'New Folder'});
						newTrack = {key: eventKey, titlte: 'New Folder'};
						return;
					}else {
						item.children = [];
						item.children.push({key: eventKey, title: 'New Folder'});
						newTrack = {key: eventKey, titlte: 'New Folder'};
					}
				} else {
				// get all the keys so we can sort and find the highest index.
					const val = item.key.split('-');
					arrIndexes.push({key: item.key, val: Number(val[0])});
					return;
				}
			}
		});
	};
	loop(dataLoop);
	const highestVal = arrIndexes.sort((a,b) => {
		return a.val - b.val;
	});
	let num = highestVal[highestVal.length - 1].key.split('-');
	num = Number(num[0]) + 1;
	const eventKey = num + '-key';
	//the folder we clicked on to create it.
	const folderKey = data.info.node.props.eventKey;
	loop(dataLoop, folderKey, eventKey);
	let expandedKeys;
	if (data.expandedKeys){
		if (data.expandedKeys[data.expandedKeys.length - 1] !== folderKey){
			expandedKeys = [...data.expandedKeys, folderKey];
		}else {
			expandedKeys = [...data.expandedKeys];
		}
	}
	axios.post('/api/tracks/create_new_folder', {user, dataLoop, newTrack, eventKey });
	dispatch({type: CREATE_TREE_FOLDER, payload: {dataLoop, eventKey, folderKey, expandedKeys} });
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
	dispatch({type: RENAME_TREE_VIEW, payload: {tree:dataLoop, key}});
};

export const editTitle	= data => async dispatch => {
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
	dispatch({type: EDIT_TITLE_VIEW, payload: dataLoop});
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
	axios.post('/api/tracks/savetree', {user, dataLoop});
	dispatch({type: SAVE_TITLE_TREE, payload: {data: dataLoop, key: null}});
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
	axios.post('/api/tracks/delete_folder', {user, dataLoop});
	dispatch({type: EDIT_TITLE_VIEW, payload: dataLoop});
};

export const onSelectTree = data => async dispatch => {

};
