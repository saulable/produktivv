import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import Days from './Days.js';
import * as actions from '../../actions/calendarActions';
import Ends from './Repeats/Ends.js';
import HandleMonth from './Repeats/handleMonth.js';
import _ from 'lodash';
import DROP_DOWN_FIELDS from './Repeats/DropDownFields';

class Repeat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			startDate: {},
			endDate: {},
			showRepeatDays: true,
			showRepeat: false,
			repeatDropdown: false,
			daysSelected: [],
			endsOnDate: '',
			afterCompletes: '',
			activeRepeatRadio: 'never',
			activeRedueRadio: '',
			showPicker: ''
		};
	}
	handleSwitch = e => {
		if (this.props.calendar.switchRepeats !== 'repeat') {
			this.props.switchRedueRepeat(e);
		} else {
			this.props.switchRedueRepeat({});
		}
	};
	renderPicker = e => {
		const { timeInterval } = this.props.calendar;
		if (timeInterval === 'week' || timeInterval === 'weeks') {
			return (
				<div className="addMarginTop">
					Repeat on<br />
					<div className="btn-group">
						<Days
							daysSelected={this.props.daysSelected}
							handleDayClick={this.props.handleDayClick}
						/>
					</div>
				</div>
			);
		} else if (timeInterval === 'month' || timeInterval === 'months') {
			return <HandleMonth />;
		}
	};
	renderDropDown() {
		const timePlural = this.props.calendar.timePlural ? 's' : '';
		return _.map(DROP_DOWN_FIELDS, ({ name }) => {
			return (
				<div
					key={name}
					data-name={name}
					onClick={this.props.handleMonthTime}
					className="dropdown-item"
				>
					{name}
					{timePlural}
				</div>
			);
		});
	}
	render() {
		const {
			switchRepeats,
			repeatTime,
			timeInterval,
			repeatDropdown,
			activeRepeatRadio,
			rptDisabled
		} = this.props.calendar;
		return (
			<div
				className={classnames('switchHeaders', {
					'd-none': rptDisabled
				})}
			>
				<div>
					<span>Repeat</span>
					<label className="switch">
						<input
							type="checkbox"
							data-tag="repeat"
							onChange={this.handleSwitch}
							checked={switchRepeats === 'repeat'}
						/>
						<span
							className={classnames('sliders round', {
								checked: switchRepeats === 'repeat' ? true : false
							})}
						/>
					</label>
				</div>
				<div
					className={classnames('box', {
						'd-none': switchRepeats === 'repeat' ? false : true
					})}
				>
					<div className="repeatChoose">
						Repeat every
						<input
							className="repeatEvery"
							value={repeatTime}
							onChange={this.props.changeTime}
							type="text"
						/>
						<div className="dropdown show">
							<button
								onClick={this.props.handleRepeatDropdown}
								className="btn btn-secondary dropdown-toggle"
								id="dropdownMenuLink"
							>
								{timeInterval}
							</button>
							<div
								className={classnames('dropdown-menu dropdownRepeat', {
									'd-block': repeatDropdown
								})}
								aria-labelledby="dropdownMenuLink"
							>
								{this.renderDropDown()}
							</div>
						</div>
					</div>
					{this.renderPicker()}
					<div className="addMarginTop">
						<Ends
							handleRadio={this.props.handleRepeatRadio}
							handleCal={this.props.handleCal}
							activeRepeatRadio={activeRepeatRadio}
							handleCompletes={this.props.handleCompletes}
						/>
					</div>
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
)(Repeat);
