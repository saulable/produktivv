import {
	TRACK_TREE_VIEW,
	UPDATE_TREE_VIEW,
	CREATE_TREE_FOLDER,
	RENAME_TREE_VIEW,
	EDIT_TITLE_VIEW,
	SAVE_TITLE_TREE,
	INIT_TRACK_VIEW,
	TRACKS_CHANGE_TREE_VIEW
} from '../actions/types';

// this reducers handles all the interactions with the elements on the daily journal page.
const initState = {
	tree: [],
	key: '',
	trackView: [],
	hotSpot: [],
	projectHeader: 'Inbox'
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
	case INIT_TRACK_VIEW: {
		if (action.payload.projectHeader){
			return {...state, trackView: action.payload.allTasks, projectHeader: action.payload.projectHeader, key: action.payload.key};
		}else {
			return {...state, trackView: action.payload.allTasks};
		}

	}
	case TRACKS_CHANGE_TREE_VIEW: {
		const index = state.hotSpot.indexOf(action.payload.type);
		if ( index >= 0 ){
			const keyPair = state.hotSpot[index];
			keyPair.value = action.payload.value;
			return {...state, hotSpot: [...state.hotSpot, keyPair] };
		}else {
			const newVal = {value: action.payload.value, id: action.payload.type};
			return {...state, hotSpot: [...state.hotSpot, newVal]};
		}
	}
	default:
		return state;
	}
}
