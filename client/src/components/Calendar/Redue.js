import React, { Component } from 'react';
import classnames from 'classnames';
import Ends from './Repeats/Ends';
import { connect } from 'react-redux';
import * as actions from '../../actions/calendarActions';
import _ from 'lodash';
import DROP_DOWN_FIELDS from './Repeats/DropDownFields';

class Redue extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showRedue: false,
			activeRepeatRadio: 'never',
			afterCompletes: '',
			endsOnDate: ''
		};
	}
	handleRepeatRadio = e => {
		this.setState({ activeRepeatRadio: e.currentTarget.dataset.name });
	};
	handleCal = e => {
		this.setState({ endsOnDate: e });
	};
	handleSwitch = e => {
		if (this.props.calendar.switchRepeats !== 'redue') {
			this.props.switchRedueRepeat(e);
		} else {
			this.props.switchRedueRepeat({});
		}
	};
	renderDropDown() {
		const timePlural = this.props.calendar.timePlural ? 's' : '';
		return _.map(DROP_DOWN_FIELDS, ({ name }) => {
			return (
				<div
					key={name}
					data-name={name}
					onClick={this.props.handleMonthTimeRedue}
					className="dropdown-item">
					{name}
					{timePlural}
				</div>
			);
		});
	}
	renderRedue() {
		const {
			switchRepeats,
			activeRedueRadio,
			rptDisabled,
			timeInterval,
			redueDropdown,
			repeatTime
		} = this.props.calendar;
		return (
			<div
				className={classnames('switchHeaders', {
					'd-none': rptDisabled
				})}>
				<div>
					<span>ReDue</span>
					<label className="switch switch2">
						<input
							type="checkbox"
							data-tag="redue"
							onChange={this.handleSwitch}
							checked={switchRepeats === 'redue'}
						/>
						<span
							className={classnames('sliders round', {
								checked: switchRepeats === 'redue' ? true : false
							})}
						/>
					</label>
				</div>
				<div
					className={classnames('', {
						'd-none': switchRepeats === 'redue' ? false : true
					})}>
					<div className="addMarginTop">
						<div className="repeatChoose">
							Redue in
							<input
								value={repeatTime}
								onChange={this.props.changeTime}
								className="repeatEvery"
							/>
							<div className="dropdown show">
								<button
									onClick={this.props.handleRedueDropdown}
									className="btn btn-secondary dropdown-toggle"
									id="dropdownMenuLink">
									{timeInterval}
								</button>
								<div
									className={classnames('dropdown-menu dropdownRepeat', {
										'd-block': redueDropdown
									})}
									aria-labelledby="dropdownMenuLink">
									{this.renderDropDown()}
								</div>
							</div>
						</div>
					</div>
					<div className="addMarginTop">
						<Ends
							handleRadio={this.props.handleRedueRadio}
							activeRepeatRadio={activeRedueRadio}
						/>
					</div>
				</div>
			</div>
		);
	}
	render() {
		return <div>{this.renderRedue()}</div>;
	}
}

function mapStateToProps({ calendar }) {
	return { calendar };
}
export default connect(
	mapStateToProps,actions
)(Redue);
