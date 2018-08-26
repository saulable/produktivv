import axios from 'axios';
import {TRACK_TREE_VIEW, UPDATE_TREE_VIEW} from './types';
import jwtDecode from 'jwt-decode';
// import moment from 'moment';

export const treeView = data => async dispatch => {
	let user;
	if (localStorage.getItem('jwtToken')) {
		user = jwtDecode(localStorage.getItem('jwtToken'));
	}
	const res = await axios.post('/api/tracktree_render', user);
	dispatch({type: TRACK_TREE_VIEW, payload: res});
};

export const updateTree = data => async dispatch => {
	let user;
	if (localStorage.getItem('jwtToken')) {
		user = jwtDecode(localStorage.getItem('jwtToken'));
	}
	axios.post('/api/update/treetree_sort', {user, data});
	dispatch({type: UPDATE_TREE_VIEW, payload: data});
};
