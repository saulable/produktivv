import axios from 'axios';
import setAuthorizationToken from '../services/setAuthorizationToken';
import jwtDecode from 'jwt-decode';
import { SET_CURRENT_USER } from './types';

export function logout() {
	return dispatch => {
		localStorage.removeItem('jwtToken');
		setAuthorizationToken(false);
		dispatch(setCurrentUser({}));
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
export function facebookLogin(data) {
	return dispatch => {
		const token = 'JWT ' + data;
		localStorage.setItem('jwtToken', token);
		setAuthorizationToken(token);
		dispatch(setCurrentUser(jwtDecode(token)));
	};
}

export function setCurrentUser(user) {
	return {
		type: SET_CURRENT_USER,
		user
	};
}

// axios
// 	.post('/api/auth/login', { username, password })
// 	.then(result => {
// 		localStorage.setItem('jwtToken', result.data.token);
// 		this.setState({ message: '' });
// 		this.props.history.push('/profile');
// 	})
// 	.catch(error => {
// 		if (error.response.status === 401) {
// 			this.setState({
// 				message: 'Login failed: Username or password do no match'
// 			});
// 		}
// 	});
