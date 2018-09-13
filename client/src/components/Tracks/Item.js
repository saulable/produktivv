import React, { Component } from 'react';
import { connect } from 'react-redux';
import {handleTaskChange, deleteTask, saveNoteChange, clickComplete, taskClick} from '../../actions/taskActions';
import {hotSpotChange} from '../../actions/trackActions';
import TextareaAutosize from 'react-autosize-textarea';


import TrackAutoSugget from './AutoSuggest/TrackAutoSuggest';
import HatAutoSuggest from './AutoSuggest/HatAutoSuggest';
import { SortableHandle } from 'react-sortable-hoc';
import classnames from 'classnames';

const DragHandle = SortableHandle(() => <div className="drag_handle" />);
class Item extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			typing: false,
			typingTimeOut: 0,
			value: '',
			suggestError: false,
		};
		this.taskChange = this.taskChange.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.clickComplete = this.clickComplete.bind(this);
		this.hotSpotChange = this.hotSpotChange.bind(this);
		this.handleHotSpot = this.handleHotSpot.bind(this);
		this.noSuggestError = this.noSuggestError.bind(this);
	}
	taskChange(e) {
		e.preventDefault();
		const { value, name } = e.target;
		const _id = e.currentTarget.dataset.id;
		this.props.handleTaskChange({ _id, value, name });
		this.autoSave(value, _id, name);
	}
	onKeyDown(e) {
		const { value, name } = e.target;
		const { dailyId } = this.props.tasks;
		const _id = e.currentTarget.dataset.id;
		if (e.target.value === '' && e.keyCode === 8) {
			this.props.deleteTask({ _id, value, name, dailyId });
		}
		// console.log(e.keyCode);
	}
	autoSave(dataNote, id, name) {
		if (this.state.typingTimeout) {
			clearTimeout(this.state.typingTimeout);
		}
		this.setState({
			name: dataNote,
			typing: false,
			typingTimeout: setTimeout(() => {
				this.props.saveNoteChange({ id, dataNote, name });
			}, 500)
		});
	}
	clickComplete(e) {
		const { list, date } = this.props.tasks;
		this.props.clickComplete(e, list, date);
	}
	hotSpotChange(type, value){
		this.setState({value});
	}
	handleHotSpot(type){
	}
	noSuggestError(val){
		this.setState({suggestError: val});
	}
	render() {
		const { value } = this.props;
		let hotSpotValue = '';
		// console.log(this.props.tracks.hotSpot);
		if (this.props.tracks.hotSpot.length > 0){
			const {hotSpot} = this.props.tracks;
			// hotSpotValue = hotSpot.map((x) => {
			// 	if (x.id === value._id){
			// 		return x.value;
			// 	}
			// });
		}
		// console.log(hotSpotValue);
		return (
			<div>
				<div className="tab-container">
					<ul className="tabs clearfix">
						<li>
							<a>
								<i className="fas fa-plus" />
							</a>
						</li>
					</ul>
				</div>
				<div className="withButton">
					<li
						data-id={value._id}
						onClick={this.props.taskClick.bind(this)}
						className={classnames('list-group-item', {
							active: this.props.notes.id === value._id ? 'active' : ''
						})}>
						<div className="click-wrapper">
							<div className="drag-div">
								<DragHandle />
								<div className="subTask">
									<i className="fas fa-arrow-down"></i>
								</div>
							</div>
							<div className="dtWrapper">
								<div className="textWrapper">
									<TextareaAutosize
										data-id={value._id}
										name="task"
										onChange={this.taskChange}
										onKeyDown={this.onKeyDown}
										value={value.message}
									/>
									<TrackAutoSugget
										onChange={this.hotSpotChange}
										id={value._id}
										placeholder="HotSpot"
										value={this.state.value}
										onSuggestionSelected={this.handleHotSpot}
										noSuggestError={this.noSuggestError}
									/>
									<HatAutoSuggest
										onChange={this.hotSpotChange}
										id={value._id}
										placeholder="Hat"
										value={this.state.value}
										onSuggestionSelected={this.handleHotSpot}
										noSuggestError={this.noSuggestError}
									/>
								</div>
								{/* <div className="hatImage">
									<div className="hatChange"></div>
								</div> */}
								<div className="checkWrapper">
									<div className="round">
										<div
											data-id={value._id}
											data-tasktype={value.taskType}
											data-start_date={value.start_date}
											data-end_date={value.end_date}
											className={classnames('inputGroup', {
												completed: value.completed
											})}
											onClick={this.clickComplete}
										/>
									</div>
								</div>
							</div>
						</div>
					</li>
					<div className="sendThis">
						<div className="sendToJournal"><i class="fas fa-book"></i></div>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps({ tasks, notes, tracks }) {
	return { tasks, notes, tracks};
}
export default connect(
	mapStateToProps,
	{handleTaskChange, deleteTask, saveNoteChange, clickComplete, taskClick,  hotSpotChange}
)(Item);
