import axios from 'axios';
import setAuthorizationToken from '../services/setAuthorizationToken';
import jwtDecode from 'jwt-decode';
import { SET_CURRENT_USER } from './types';

export function setCurrentUser(user) {
	return {
		type: SET_CURRENT_USER,
		user
	};
}
export function login(data) {
	return dispatch => {
		return axios.post('/api/auth/login', data).then(res => {
			const token = res.data.token;
			localStorage.setItem('jwtToken', token);
			setAuthorizationToken(token);
			dispatch(setCurrentUser(jwtDecode(token)));
		});
	};
}
export function checkedLogin(data) {
	return dispatch => {
		if (data) {
			const token = data;
			setAuthorizationToken(token);
			dispatch(setCurrentUser(jwtDecode(token)));
		}
	};
}
export function facebookLogin(data) {
	return dispatch => {
		if (data) {
			const token = 'JWT ' + data;
			localStorage.setItem('jwtToken', token);
			setAuthorizationToken(token);
			dispatch(setCurrentUser(jwtDecode(token)));
		}
	};
}
