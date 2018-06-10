import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import Days from './Days.js';
import { switchRepeat } from '../../actions/calendarActions';
import Ends from './Repeats/Ends.js';
import OfMonth from './Repeats/ofMonth';
import _ from 'lodash';
import moment from 'moment';

class Repeat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			startDate: {},
			endDate: {},
			showRepeatDays: true,
			showRedue: true,
			timeInterval: 'week',
			repeatDropdown: false,
			repeatTime: '1',
			timePlural: false,
			daysSelected: [],
			endsOnDate: '',
			afterCompletes: '',
			activeRepeatRadio: 'never',
			activeRedueRadio: '',
			showPicker: '',
			monthlyRepeat: 'onNumberDays',
			monthlyBoth: false
		};
		this.updateState = this.updateState.bind(this);
		this.handleMonthTime = this.handleMonthTime.bind(this);
		this.changeTime = this.changeTime.bind(this);
		this.handleDayClick = this.handleDayClick.bind(this);
	}
	componentDidMount() {
		this.setState({
			startDate: this.props.startDate,
			endDate: this.props.endDate
		});
	}
	updateState(e) {
		const name = e.currentTarget.dataset.tag;
		if (this.props.calendar.switchRepeats === 'repeat') {
			this.props.switchRepeat(null);
			this.setState({ showRepeatDays: !this.state.showRepeatDays });
		} else if (!this.props.calendar.switchRepeats) {
			this.props.switchRepeat(name);
			this.setState({ showRepeatDays: !this.state.showRepeatDays });
		} else {
			e.preventDefault();
			alert('It is currently disabled');
		}
	}
	handleMonthTime(e) {
		e.preventDefault();
		const { name } = e.currentTarget.dataset;
		if (this.state.timePlural) {
			this.setState({ timeInterval: name + 's', repeatDropdown: false });
		} else {
			this.setState({ timeInterval: name, repeatDropdown: false });
		}
	}
	changeTime(e) {
		e.preventDefault();
		if (e.target.value > 1) {
			if (this.state.timePlural) {
				this.setState({ repeatTime: e.target.value });
			} else {
				this.setState({
					repeatTime: e.target.value,
					timePlural: true,
					timeInterval: this.state.timeInterval + 's'
				});
			}
		} else if (this.state.timePlural) {
			// it's one and timeplural is true, remove the s
			this.setState({
				timeInterval: this.state.timeInterval.slice(0, -1),
				timePlural: false,
				repeatTime: e.target.value
			});
		} else {
			// else its one and time plural is false
			this.setState({ repeatTime: e.target.value });
		}
	}
	handleCal = e => {
		this.setState({ endsOnDate: e });
	};
	handleDayClick = e => {
		const day = e.currentTarget.dataset.id;
		const data = this.state.daysSelected;
		const index = this.state.daysSelected.indexOf(day);
		if (_.includes(data, day)) {
			this.setState({
				daysSelected: [...data.slice(0, index), ...data.slice(index + 1)]
			});
		} else {
			this.setState({ daysSelected: [...this.state.daysSelected, day] });
		}
	};
	handleCompletes = e => {
		this.setState({ afterCompletes: e.target.value });
	};
	handleRepeatRadio = e => {
		this.setState({ activeRepeatRadio: e.currentTarget.dataset.name });
	};
	clickMonth = e => {
		const {name} = e.currentTarget.dataset;
		console.log(name);
		this.setState({monthlyBoth: !this.state.monthlyBoth, monthlyRepeat: name });
	}
	renderPicker = e => {
		if (
			this.state.timeInterval === 'week' ||
			this.state.timeInterval === 'weeks'
		) {
			return (
				<div className="addMarginTop">
					Repeat on<br />
					<div className="btn-group">
						<Days
							daysSelected={this.state.daysSelected}
							handleDayClick={this.handleDayClick}
						/>
					</div>
				</div>
			);
		} else if (
			this.state.timeInterval === 'month' ||
			this.state.timeInterval === 'months'
		) {
			return (
				<div className="addMarginTop">
					<div
						className={classnames('dropdown-month', {
							'hide': this.state.monthlyRepeat !== 'onNumberDays',
							'show-both': this.state.monthlyBoth
						})}
						onClick={this.handleMonthDrop}
					>
						<div className="dropdown-select" data-name="onNumberDays" onClick={this.clickMonth}>
							On the {this.props.startDate.format('Do')} of every month
						</div>
					</div>
					<div
						onClick
						className="dropdown-month"
						className={classnames('dropdown-month', {
							'hide': this.state.monthlyRepeat !== 'nthDay',
							'show-both': this.state.monthlyBoth
						})}
						onClick={this.handleMonthDrop}
					>
						<div className="dropdown-select" data-name="nthDay" onClick={this.clickMonth}>
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
	render() {
		const timePlural = this.state.timePlural ? 's' : '';
		return (
			<div className="switchHeaders">
				<div>
					<span>Repeat</span>
					<label className="switch">
						<input
							type="checkbox"
							data-tag="repeat"
							onClick={this.updateState}
						/>
						<span className="slider round" />
					</label>
				</div>
				<div
					className={classnames('box', {
						'd-none': this.state.showRepeatDays ? true : false
					})}
				>
					<div>
						Repeat every{' '}
						<input
							className="repeatEvery"
							value={this.state.repeatTime}
							onChange={this.changeTime}
							type="text"
						/>
						<div className="dropdown show">
							<button
								onClick={() =>
									this.setState({ repeatDropdown: !this.state.repeatDropdown })
								}
								className="btn btn-secondary dropdown-toggle"
								id="dropdownMenuLink"
							>
								{this.state.timeInterval}
							</button>
							<div
								className={classnames('dropdown-menu dropdownRepeat', {
									'd-block': this.state.repeatDropdown
								})}
								aria-labelledby="dropdownMenuLink"
							>
								<div
									data-name="day"
									onClick={this.handleMonthTime}
									className="dropdown-item"
								>
									day{timePlural}
								</div>
								<div
									data-name="week"
									onClick={this.handleMonthTime}
									className="dropdown-item"
								>
									week{timePlural}
								</div>
								<div
									data-name="month"
									onClick={this.handleMonthTime}
									className="dropdown-item"
								>
									month{timePlural}
								</div>
								<div
									data-name="year"
									onClick={this.handleMonthTime}
									className="dropdown-item"
								>
									year{timePlural}
								</div>
							</div>
						</div>
					</div>
					{this.renderPicker()}
					<div className="addMarginTop">
						<Ends
							startDate={this.state.startDate}
							endDate={this.state.endDate}
							handleCal={this.handleCal}
							completesValue={this.state.afterCompletes}
							handleCompletes={this.handleCompletes}
							activeRepeatRadio={this.state.activeRepeatRadio}
							handleRepeatRadio={this.handleRepeatRadio}
							handleRedueRadio={this.handleRedueRadio}
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

export default connect(mapStateToProps, { switchRepeat })(Repeat);
