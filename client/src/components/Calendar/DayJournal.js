'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/taskActions';
import moment from 'moment';
import Entries from '../Journals/DailyJournal/Entries';
var _dates = require('react-big-calendar/lib/utils/dates');

var _dates2 = _interopRequireDefault(_dates);
function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var _constants = require('react-big-calendar/lib/utils/constants');

var _localizer = require('react-big-calendar/lib/localizer');

// const DayJournal = () => {
// 	return
// };
class DayJournal extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		this.props.renderTasks(this.props.events, this.props.date);
	}
	componentDidUpdate(prevProps) {
		if (this.props.date !== prevProps.date) {
			this.props.renderTasks(this.props.events, this.props.date);
		}
	}
	render() {
		return (
			<div>
				<Entries />
			</div>
		);
	}
}

DayJournal.range = function(date) {
	return [_dates2.default.startOf(date, 'day')];
};
DayJournal.navigate = function(date, action) {
	switch (action) {
	case _constants.navigate.PREVIOUS:
		return _dates2.default.add(date, -1, 'day');

	case _constants.navigate.NEXT:
		return _dates2.default.add(date, 1, 'day');

	default:
		return date;
	}
};
DayJournal.title = function(date, _ref) {
	var formats = _ref.formats,
		culture = _ref.culture;
	return _localizer.default.format(date, formats.dayHeaderFormat, culture);
};

function mapStateToProps({ tasks }) {
	return { tasks };
}

export default connect(
	mapStateToProps,
	actions
)(DayJournal);
