import {
	TASK_LI_CLICK,
	UPDATE_TABS,
	NOTE_WRITE,
	JOURNAL_WRITE,
	JOURNAL_CREATED,
} from '../actions/types';

export default function(state = {}, action) {
	switch (action.type) {
	case TASK_LI_CLICK:
		return {
			...state,
			id: action.payload.data._id,
			tab: 'notes',
			note: action.payload.data.note
		};
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
			tab: 'journal',
			journalmessage: action.payload[0].message,
			journalid: action.payload[0]._id
		};
	}
	default:
		return state;
	}
}
