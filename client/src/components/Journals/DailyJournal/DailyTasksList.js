import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/taskActions';
import SortableList from './SortableList';
import { arrayMove } from 'react-sortable-hoc';

class DailyTaskList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			typing: false,
			typingTimeOut: 0
		};
		this.onSortEnd = this.onSortEnd.bind(this);
	}
	componentWillMount() {
		this.props.createJournal();
	}
	onSortEnd({ oldIndex, newIndex }) {
		const {list, dailyId} = this.props.tasks;
		const newOrderedList = arrayMove(
			list,
			oldIndex,
			newIndex
		);
		this.props.newOrder(newOrderedList, dailyId);
	}
	render() {
		return (
			<div className="dailyTaskList">
				<div className="card">
					<div className="card-header">Must Complete</div>
				</div>
				<div>
					<SortableList
						items={this.props.tasks.list}
						onSortEnd={this.onSortEnd}
						helperClass="SortableHelper"
						useDragHandle={true}
					/>
				</div>
			</div>
		);
	}
}
function mapStateToProps({ tasks }) {
	return { tasks };
}
export default connect(
	mapStateToProps,
	actions
)(DailyTaskList);
