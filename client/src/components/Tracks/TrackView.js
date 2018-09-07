import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/trackActions';
import SortableList from './SortableList';
import SortableTree, { changeNodeAtPath, removeNodeAtPath } from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import TextFieldGroup from '../../containers/TextFieldGroup';
import TrackAutoSuggest from './AutoSuggest/TrackAutoSuggest';
import classnames from 'classnames';

class TrackView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			treeData: [],
			value: '',
		};
		this.hotSpotChange = this.hotSpotChange.bind(this);
		this.handleTrackComplete = this.handleTrackComplete.bind(this);
	}
	componentDidMount() {
		this.props.initTrackView();
	}
	updateTaskMessage(node, path, getNodeKey, name){
		const treeData = changeNodeAtPath({
			treeData: this.props.tracks.trackView,
			path,
			getNodeKey,
			newNode: { ...node, message: name}
		});
		// TODO add a set timeout to update the DB after x seconds, instead of repeating it every time we change a character.
		this.props.editTrackView({treeData: treeData, key: this.props.tracks.key});
	}
	hotSpotChange(node, path, getNodeKey, value){
		const treeData = changeNodeAtPath({
			treeData: this.props.tracks.trackView,
			path,
			getNodeKey,
			newNode: { ...node, title: value}
		});
		// TODO add a set timeout to update the DB after x seconds, instead of repeating it every time we change a character.
		// this.props.editTrackView({treeData: treeData, key: this.props.tracks.key});
		this.props.editTrackView({treeData: treeData, key: this.props.tracks.key});
	}

	// This is where we change the title of the hotspot.
	handleHotSpot(node, path, getNodeKey, value){
		const treeData = removeNodeAtPath({
			treeData: this.props.tracks.trackView,
			path,
			getNodeKey
		});
		this.props.renameTrackView({treeData: treeData, key: this.props.tracks.key});
		this.props.hotSpotChange({treeData: node, id: value.suggestion.id});
	}
	handleTrackComplete(node, path, getNodeKey){
		const treeData = changeNodeAtPath({
			treeData: this.props.tracks.trackView,
			path,
			getNodeKey,
			newNode: { ...node, completed: !node.completed}
		});
		// TODO add a set timeout to update the DB after x seconds, instead of repeating it every time we change a character.
		// this.props.editTrackView({treeData: treeData, key: this.props.tracks.key});
		this.props.clickCompleteTrack({treeData: treeData, key: this.props.tracks.key, item: node});
	}
	render() {
		const getNodeKey = ({ treeIndex }) => treeIndex;
		const placeholder = `Enter a track: ${this.props.tracks.projectHeader}`;
		return (
			<div className="wrapper journal-content">
				<div className="container-fluid">
					<div className="row">
						{/* <div className="input-box col-12">
							<form onSubmit={this.onSubmit} className="tasks">
								<TextFieldGroup
									field="message"
									label="Daily Task"
									placeholder={placeholder}
									onChange={this.onChange}
									value={this.state.message}
								/>
							</form>
						</div> */}
						<div className="tasks">{this.props.tracks.projectHeader}</div>
					</div>
					<div className="must-complete">
						<div className="dailyTaskList">
							<div>
								<div style={{height: '100vh'}}>
									<SortableTree
										treeData={this.props.tracks.trackView}
										// isVirtualized={false}
										onChange={treeData =>
											this.props.editTrackView({ treeData , key: this.props.tracks.key})
										}
										generateNodeProps={({ node, path }) => ({
											title: (
												<div>
													<input
														style={{ fontSize: '16px' }}
														value={node.message}
														onChange={event => {
															const name = event.target.value;
															this.updateTaskMessage(
																node,
																path,
																getNodeKey,
																name
															);
														}}
													/>
													<TrackAutoSuggest
														onChange={(event, newVal ) => {
															const name = newVal;
															this.hotSpotChange(
																node,
																path,
																getNodeKey,
																name
															);
														}}
														id={node._id}
														placeholder="HotSpot"
														value={(node.title) ? node.title : ''}
														onSuggestionSelected={(event,newVal) => {
															const name = newVal;
															this.handleHotSpot(
																node,
																path,
																getNodeKey,
																name
															);
														}}
														// noSuggestError={this.noSuggestError}
													/>
													<div onClick={(event, newVal) => {
														this.handleTrackComplete(node, path, getNodeKey);
													}}
													className={classnames('round', {
														completed: (node.completed === true)
													})}>
														{/* {this.logNode(node)} */}
													</div>
												</div>
											)
										})}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
function mapStateToProps({ tracks }) {
	return { tracks };
}
export default connect(
	mapStateToProps,
	actions
)(TrackView);
