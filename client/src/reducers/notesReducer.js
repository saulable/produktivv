import {
	TASK_LI_CLICK,
	UPDATE_TABS,
	NOTE_WRITE,
	JOURNAL_WRITE,
	JOURNAL_CREATED,
	HELPER_POP,
	TASK_OFF_CLICK,
	JOURNAL_AUTOSAVE
} from '../actions/types';

// this reducers handles all the interactions with the elements on the daily journal page.
const initState = {
	journal_autosaved: false
};

export default function(state = initState, action) {
	switch (action.type) {
	case TASK_LI_CLICK: {
		return {
			...state,
			task: action.payload.data,
			taskSettings: true
		};
	}
	case TASK_OFF_CLICK: {
		if (state.taskSettings)  {
			state.taskSettings = false;
			state.id = null;
		}
		return {
			...state
		};
	}
	case NOTE_WRITE:
		return { ...state, note: action.payload.data };
	case JOURNAL_WRITE:
		return { ...state, journalmessage: action.payload.data };
	case UPDATE_TABS: {
		return { ...state, tab: action.payload };
	}
	case JOURNAL_CREATED: {
		return {
			...state,
			journalmessage: action.payload[0].message,
			journalid: action.payload[0]._id
		};
	}
	case JOURNAL_AUTOSAVE: {
		return {
			...state,
			journal_autosaved: action.payload.success
		};
	}
	case HELPER_POP: {
		if (state.tab && state.tab === action.payload) {
			state.tab = null;
			return { ...state };
		}
		return { ...state, tab: action.payload };
	}
	default:
		return state;
	}
}
