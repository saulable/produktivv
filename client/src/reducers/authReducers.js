import { LOGOUT_USER } from '../actions/types';

const initialState = {
	isAuthenticated: false,
	user: {}
};

export default function(state = null, action) {
	switch (action.type) {
	case LOGOUT_USER:
		return state = undefined;
	default:
		return state;
	}
}
