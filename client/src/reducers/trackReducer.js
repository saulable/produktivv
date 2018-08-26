import {
	TRACK_TREE_VIEW,
	UPDATE_TREE_VIEW
} from '../actions/types';

// this reducers handles all the interactions with the elements on the daily journal page.
const initState = {
	tree: []
};
export default function(state = initState, action) {
	switch (action.type) {
	case TRACK_TREE_VIEW: {
		return {...state, tree: action.payload.data.tree};
	}
	case UPDATE_TREE_VIEW: {
		return {...state, tree: action.payload};
	}
	default:
		return state;
	}
}
