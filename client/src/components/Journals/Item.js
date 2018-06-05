import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/taskActions';
import TextareaAutosize from 'react-autosize-textarea';
import { SortableHandle } from 'react-sortable-hoc';
import classnames from 'classnames';

const DragHandle = SortableHandle(() => <div className="drag_handle"></div>);
class Item extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			typing: false,
			typingTimeOut: 0,
		};
		this.taskChange = this.taskChange.bind(this);
	}
	taskChange(e) {
		e.preventDefault();
		const { value, name } = e.target;
		const _id = e.currentTarget.dataset.id;
		this.props.handleTaskChange({ _id, value , name});
		this.autoSave(value, _id, name);
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
				className="list-group-item"
			>
				<div className="click-wrapper">
					<DragHandle />
					<TextareaAutosize
						data-id={value._id}
						name="task"
						onChange={this.taskChange}
						value={value.message}
					/>
					<div className="round float-right align-middle">
						<div data-id={value._id} className={classnames('inputGroup', {
							'completed' : value.completed
						})} onClick={this.props.clickComplete}>
						</div>
					</div>
				</div>

			</li>
		);
	}
}

function mapStateToProps({tasks})  {
	return {tasks};
}
export default connect(mapStateToProps, actions)(Item);
