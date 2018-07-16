import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/calendarActions';

class Duration extends Component {
	constructor(props) {
		super(props);
		this.handleInput = this.handleInput.bind(this);
	}
	handleInput(e) {
		const time = e.target.value;
		this.props.updateDuration(time);
	}
	handleDuration(){
		const duration = this.props.calendar.taskDurationFormat;
		switch (duration){
		case 'h':
			return 'hours';
		case 'd':
			return 'days';
		case 'w':
			return 'weeks';
		case 'm':
			return 'months';
		default:
			return 'hours';
		}
	}
	render() {
		return (
			<div className="startTimes">
				<div className="durationTimes">
					<span className="title">Duration:</span>
					<input
						onChange={this.handleInput}
						className="duration"
						value={this.props.calendar.taskDuration}
					/>
					<span>{this.handleDuration()}</span>
				</div>
			</div>
		);
	}
}

function mapStateToProps({ calendar }) {
	return { calendar };
}

export default connect(
	mapStateToProps,
	actions
)(Duration);
