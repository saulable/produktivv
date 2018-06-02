import {INIT_CAL_TASKS} from '../actions/types';
import isEmpty from 'lodash/isEmpty';

export default (state = {}, action) => {
	switch (action.type) {
	case INIT_CAL_TASKS:
		return {...state, data: action.payload.data  };
	default:
		return state;
	}
};
