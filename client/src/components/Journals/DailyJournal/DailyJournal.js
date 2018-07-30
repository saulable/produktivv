import React, { Component } from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../actions/taskActions';
import LeftNavigation from '../../../containers/LeftNavigation';
import Entries from './Entries';

class DailyJournal extends Component {
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
					<Entries />
				</div>
			</div>
		);
	}
}

function mapStateToProps({calendar}){
	return {calendar};
}
export default connect(null, actions)(DailyJournal);
