import { CREATE_TASK } from '../actions/types';
import {
	DAILY_TASK_LIST,
	COMPLETE_TASK,
	UPDATE_TASK_MESSAGE,
	UPDATE_TASK_LIST,
	DELETED_TASK,
	DAY_CALENDAR_TASKS
} from '../actions/types';
import _ from 'lodash';

const initState = {
	list: [],
	dailyId:  ''
};

export default function(state = initState, action) {
	switch (action.type) {
	case CREATE_TASK:{
		const list = [...state.list, action.payload];
		return {...state, list};
	}
	case DELETED_TASK:
		return {...state, list: action.payload.data};
	case COMPLETE_TASK: {
		// find the item that we clicked, by the passed in ID
		const index = _.findIndex([...state.list], { _id: action.payload.data._id });
		if (index >= 0) {
			// if there is a match, toggle the state.
			state.list[index].completed = !state.list[index].completed;
			return {...state};
		}
		return state;
	}
	case UPDATE_TASK_MESSAGE: {
		const index = _.findIndex([...state.list], { _id: action.payload._id });
		if (index >= 0) {
			state.list[index].message = action.payload.value;
			return {...state};
		}
		return state;
	}
	case UPDATE_TASK_LIST: {
		return {...state, list: action.payload};
		// return arrayMove([...state], action.payload.oldIndex, action.payload.newIndex);
	}
	case DAILY_TASK_LIST:
		// var sortedTasks = _.sortBy(action.payload.taskList, ['index', action.payload.index]);
		return {...state, list:action.payload.taskList, dailyId: action.payload._id};
	case DAY_CALENDAR_TASKS:
		return {...state, list: action.payload};
	default:
		return {...state};
	}
}
