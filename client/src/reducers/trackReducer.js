import {
	TRACK_TREE_VIEW,
	UPDATE_TREE_VIEW,
	CREATE_TREE_FOLDER,
	RENAME_TREE_VIEW,
	EDIT_TITLE_VIEW,
	SAVE_TITLE_TREE
} from '../actions/types';

// this reducers handles all the interactions with the elements on the daily journal page.
const initState = {
	tree: [],
	key: ''
};
export default function(state = initState, action) {
	switch (action.type) {
	case TRACK_TREE_VIEW: {
		return { ...state, tree: action.payload.data.tree };
	}
	case UPDATE_TREE_VIEW: {
		return { ...state, tree: action.payload };
	}
	case CREATE_TREE_FOLDER: {
		const { eventKey, dataLoop, folderKey, expandedKeys} = action.payload;
		// const tree = [...state.tree, { key: eventKey, title: 'New Folder' }];
		return { ...state, tree: dataLoop, key: eventKey, folderKey, expandedKeys };
	}
	case RENAME_TREE_VIEW: {
		return {
			...state,
			tree: action.payload.tree,
			key: action.payload.key,
			editable: true
		};
	}
	case EDIT_TITLE_VIEW: {
		return { ...state, tree: action.payload };
	}
	case SAVE_TITLE_TREE: {
		return {
			...state,
			tree: action.payload.data,
			key: action.payload.key,
			editable: false
		};
	}
	default:
		return state;
	}
}
