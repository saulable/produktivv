import React, { Component } from 'react';
import classnames from 'classnames';
import Ends from './Repeats/Ends';
import { connect } from 'react-redux';
import { switchRedueRepeat, handleRedueRadio } from '../../actions/calendarActions';

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
		if (this.props.calendar.switchRepeats !== 'redue'){
			this.props.switchRedueRepeat(e);
		}else {
			this.props.switchRedueRepeat({});
		}
	}
	renderRedue() {
		const {switchRepeats, activeRedueRadio, rptDisabled} = this.props.calendar;
		return (
			<div className={classnames('switchHeaders', {
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
						<span className={classnames('sliders round', {
							'checked': (switchRepeats === 'redue') ? true : false
						})} />
					</label>
				</div>
				<div
					className={classnames('', {
						'd-none': (switchRepeats === 'redue') ? false : true
					})}
				>
					<div className="addMarginTop">
						Redue in <input onChange={this.props.redueDaysChange} value={this.props.redueDays} className="repeatEvery" /> days.
					</div>
					<div></div>
					<div className="addMarginTop">
						<Ends handleRadio={this.props.handleRedueRadio} activeRepeatRadio={activeRedueRadio} />
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
export default connect(mapStateToProps, { switchRedueRepeat, handleRedueRadio })(Redue);
