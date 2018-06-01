import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { dbTasks, taskClick, createJournal, clickComplete, handleTaskChange, saveNoteChange, newOrder} from '../../actions/taskActions';
import classnames from 'classnames';
import TextareaAutosize from 'react-autosize-textarea';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import SortableList from './SortableList';


class DailyTaskList extends Component {
	constructor(props){
		super(props);
		this.state = {
			name: '',
			typing: false,
			typingTimeOut: 0,
		};
	}
	componentWillMount() {
		if (localStorage.getItem('jwtToken')) {
			this.props.dbTasks();
			this.props.createJournal();
		}
	}
	renderContent(items) {
		return _.map(this.props.tasks, items => {
			return (
				<li onClick={this.props.taskClick.bind(this)} className="list-group-item" key={items._id} data-id={items._id}>
					<div className="click-wrapper">
						<TextareaAutosize data-id={items._id} name="task" onChange={this.taskChange} value={items.message} />
					</div>
					<div className="round float-right align-middle">
						<div key={items._id} data-id={items._id} className={classnames('inputGroup', {
							'completed' : items.completed
						})} onClick={this.props.clickComplete}>
						</div>
					</div>
				</li>
			);
		});
	}
	render() {
		return (
			<div>
				<div className="card">
					<div className="card-header">Must Complete</div>
				</div>
				<div>
					<SortableList items={this.props.tasks} onSortEnd={this.props.newOrder} useDragHandle={true} />
				</div>
			</div>
		);
	}
}
function mapStateToProps({ tasks }) {
	return { tasks };
}
export default connect(mapStateToProps, { dbTasks, taskClick, createJournal, clickComplete, handleTaskChange, saveNoteChange, newOrder })(DailyTaskList);
