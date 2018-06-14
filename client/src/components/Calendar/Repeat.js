import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import Days from './Days.js';
import { switchRedueRepeat } from '../../actions/calendarActions';
import Ends from './Repeats/Ends.js';
import OfMonth from './Repeats/ofMonth';
import _ from 'lodash';
import moment from 'moment';
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
			showPicker: '',
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
		if (
			this.props.timeInterval === 'week' ||
			this.props.timeInterval === 'weeks'
		) {
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
		} else if (
			this.props.timeInterval === 'month' ||
			this.props.timeInterval === 'months'
		) {
			return (
				<div className="addMarginTop">
					<div
						className={classnames('dropdown-month', {
							'hide': this.props.monthlyRepeat !== 'noDays',
							'show-both': this.props.monthlyBoth
						})}
						onClick={this.props.clickMonth}
						data-name="noDays"
					>
						<div
							className="dropdown-select"
						>
							On the {this.props.startDate.format('Do')} of every month
						</div>
					</div>
					<div
						className={classnames('dropdown-month', {
							'hide': this.props.monthlyRepeat !== 'nthDay',
							'show-both': this.props.monthlyBoth
						})}
						onClick={this.props.clickMonth}
						data-name="nthDay"
					>
						<div
							className="dropdown-select"

						>
							<OfMonth
								startDate={this.props.startDate}
								endDate={this.props.endDate}
							/>
						</div>
					</div>
				</div>
			);
		}
	};
	renderDropDown(){
		const timePlural = this.props.timePlural ? 's' : '';
		return _.map(DROP_DOWN_FIELDS, ({name}) => {
			return (
				<div key={name} data-name={name} onClick={this.props.handleMonthTime} className="dropdown-item">
					{name}{timePlural}
				</div>
			);
		});
	}
	render() {
		const { switchRepeats } = this.props.calendar;
		return (
			<div className="switchHeaders">
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
							className={classnames('slider round', {
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
					<div>
						Repeat every
						<input
							className="repeatEvery"
							value={this.props.repeatTime}
							onChange={this.props.changeTime}
							type="text"
						/>
						<div className="dropdown show">
							<button
								onClick={this.props.handleRepeatDropdown}
								className="btn btn-secondary dropdown-toggle"
								id="dropdownMenuLink"
							>
								{this.props.timeInterval}
							</button>
							<div
								className={classnames('dropdown-menu dropdownRepeat', {
									'd-block': this.props.repeatDropdown
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
							startDate={this.props.startDate}
							endDate={this.props.endDate}
							handleCal={this.props.handleCal}
							handleCompletes={this.props.handleCompletes}
							completesValue={this.props.afterCompletes}
							activeRepeatRadio={this.props.activeRepeatRadio}
							handleRepeatRadio={this.props.handleRepeatRadio}
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

export default connect(mapStateToProps, { switchRedueRepeat })(Repeat);
