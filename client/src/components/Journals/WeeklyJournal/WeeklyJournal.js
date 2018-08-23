import React, { Component } from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../actions/taskActions';
import LeftNavigation from '../../../containers/LeftNavigation';

class WeeklyJournal extends Component {
	componentDidMount() {
		if (localStorage.getItem('jwtToken')) {
			this.props.dbTasks();
		}
	}
	render() {
		return (
			<div className="container">
				<LeftNavigation />
				<div className="content-x">

				</div>
			</div>
		);
	}
}

export default connect(null, actions)(WeeklyJournal);
