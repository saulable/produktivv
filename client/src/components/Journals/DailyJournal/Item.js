import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/taskActions';
import TextareaAutosize from 'react-autosize-textarea';
import { SortableHandle } from 'react-sortable-hoc';
import classnames from 'classnames';

const DragHandle = SortableHandle(() => <div className="drag_handle" />);
class Item extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			typing: false,
			typingTimeOut: 0
		};
		this.taskChange = this.taskChange.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
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
		const _id = e.currentTarget.dataset.id;
		if (e.target.value === '' && e.keyCode === 8) {
			this.props.deleteTask({ _id, value, name });
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
	render() {
		const { value } = this.props;
		return (
			<li
				data-id={value._id}
				onClick={this.props.taskClick.bind(this)}
				className={classnames('list-group-item', {
					active: this.props.notes.id === value._id ? 'active' : ''
				})}
			>
				<div className="click-wrapper">
					<div className="drag-div">
						<DragHandle />
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
						</div>
						<div className="checkWrapper">
							<div className="round">
								<div
									data-id={value._id}
									className={classnames('inputGroup', {
										completed: value.completed
									})}
									onClick={this.props.clickComplete}
								/>
							</div>
						</div>
					</div>
				</div>
			</li>
		);
	}
}

function mapStateToProps({ tasks, notes }) {
	return { tasks, notes };
}
export default connect(
	mapStateToProps,
	actions
)(Item);
