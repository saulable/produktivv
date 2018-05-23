import { LOGOUT_USER } from '../actions/types';
import {SET_CURRENT_USER} from '../actions/types';
import isEmpty from 'lodash/isEmpty';

const initialState = {
	isAuthenticated: false,
	user: {}
};

export default function(state = initialState, action) {
	switch (action.type) {
	case SET_CURRENT_USER:
		return {
			isAuthenticated: !isEmpty(action.user),
			user: action.user
		};
	case LOGOUT_USER:
		return (state = undefined);
	default:
		return state;
	}
}
