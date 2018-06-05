import { CREATE_TASK } from '../actions/types';
import {
	DAILY_TASK_LIST,
	COMPLETE_TASK,
	UPDATE_TASK_MESSAGE,
	UPDATE_TASK_LIST
} from '../actions/types';
import _ from 'lodash';
import { arrayMove } from 'react-sortable-hoc';
import axios from 'axios';

export default function(state = [], action) {
	switch (action.type) {
	case CREATE_TASK:
		return [...state, action.payload];
	case COMPLETE_TASK: {
		const index = _.findIndex([...state], { _id: action.payload.data._id });
		if (index >= 0) {
			// this maybe needs some more work?
			const result = [...state];
			result.splice(index, 1, action.payload.data);
			return result;
		}
		return state;
	}
	case UPDATE_TASK_MESSAGE: {
		const index = _.findIndex([...state], { _id: action.payload._id });
		if (index >= 0) {
			const result = [...state][index];
			result.message = action.payload.value;
			const joinedResult = [...state];
			joinedResult.splice(index, 1, result);
			return joinedResult;
		}
		return state;
	}
	case UPDATE_TASK_LIST: {
		const data = [...state];
		const check = arrayMove(data, action.payload.oldIndex, action.payload.newIndex);
		const sendData = {items: check};
		axios.post('/api/update_task_index', sendData);
		return check;
		// return arrayMove([...state], action.payload.oldIndex, action.payload.newIndex);
	}
	case DAILY_TASK_LIST:
		var sortedTasks = _.sortBy(action.payload, ['index', action.payload.index]);
		return sortedTasks;
	default:
		return state;
	}
}
