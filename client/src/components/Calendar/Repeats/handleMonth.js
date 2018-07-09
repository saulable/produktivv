import React, { Component } from 'react';
import OfMonth from './ofMonth';
import * as actions from '../../../actions/calendarActions';
import { connect } from 'react-redux';

class HandleMonth extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showBoth: false
		};
	}
	renderBothMonths() {
		return (
			<div className="dropdowns">
				<div
					className="dropdown-month"
					onClick={this.props.clickMonth}
					data-name="noDays"
				>
					On the {this.props.calendar.startDate.format('Do')} of every month
				</div>
				<div
					className="dropdown-month"
					onClick={this.props.clickMonth}
					data-name="nthDay"
				>
					<OfMonth
						startDate={this.props.calendar.startDate}
						endDate={this.props.calendar.endDate}
					/>
				</div>
			</div>
		);
	}
	renderSingleMonth() {
		// when you click on the month and it is equal to the current state, show both.
		if (this.props.calendar.monthChoice === 'noDays') {
			return (
				<div
					className="dropdown-month"
					onClick={this.props.clickMonth}
					data-name="noDays"
				>
					On the {this.props.calendar.startDate.format('Do')} of every month
				</div>
			);
		} else if (this.props.calendar.monthChoice === 'nthDay') {
			return (
				<div
					className="dropdown-month"
					onClick={this.props.clickMonth}
					data-name="nthDay"
				>
					<OfMonth
						startDate={this.props.calendar.startDate}
						endDate={this.props.calendar.endDate}
					/>
				</div>
			);
		}
	}
	render() {
		return (
			<div className="addMarginTop">
				{this.props.calendar.showBoth
					? this.renderBothMonths()
					: this.renderSingleMonth()}
			</div>
		);
	}
}

function mapStateToProps({ calendar }) {
	return { calendar };
}

const mapDispatchToProps = dispatch => ({});

export default connect(
	mapStateToProps,
	actions
)(HandleMonth);
