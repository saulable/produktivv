import React, { Component } from 'react';
import classnames from 'classnames';
import Ends from './Repeats/Ends';
import { connect } from 'react-redux';
import { switchRedueRepeat } from '../../actions/calendarActions';

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
		const {switchRepeats} = this.props.calendar;
		return (
			<div className="switchHeaders">
				<div>
					<span>ReDue</span>
					<label className="switch switch2">
						<input
							type="checkbox"
							data-tag="redue"
							onChange={this.handleSwitch}
							checked={switchRepeats === 'redue'}
						/>
						<span className={classnames('slider round', {
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
						<Ends
							startDate={this.props.startDate}
							endDate={this.props.endDate}
							handleCal={this.handleCal}
							completesValue={this.props.afterCompletes}
							handleCompletes={this.props.handleCompletes}
							activeRepeatRadio={this.state.activeRepeatRadio}
							handleRepeatRadio={this.handleRepeatRadio}
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
export default connect(mapStateToProps, { switchRedueRepeat })(Redue);
