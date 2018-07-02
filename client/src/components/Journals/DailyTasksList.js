import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/taskActions';
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
	}
	render() {
		return (
			<div className="dailyTaskList">
				<div className="card">
					<div className="card-header">Must Complete</div>
				</div>
				<div>
					<SortableList items={this.props.tasks} onSortEnd={this.props.newOrder} helperClass="SortableHelper" useDragHandle={true} />
				</div>
			</div>
		);
	}
}
function mapStateToProps({ tasks }) {
	return { tasks };
}
export default connect(mapStateToProps, actions)(DailyTaskList);
