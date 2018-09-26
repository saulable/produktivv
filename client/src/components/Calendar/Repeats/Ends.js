import React, { Component } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import CustomOverlay from './CustomOverlay';
import 'react-day-picker/lib/style.css';
import { connect } from 'react-redux';
import classnames from 'classnames';
import MomentLocaleUtils, {
	formatDate,
	parseDate
} from 'react-day-picker/moment';

import {handleCompletes, catchUp} from '../../../actions/calendarActions';
import 'moment/locale/en-gb';

class Ends extends Component {
	catchUp(){
		let {timeInterval, timePlural, activeRepeatRadio, switchRepeats, repeatCarry} = this.props.calendar;
		if (timePlural){
			timeInterval = timeInterval.substring(0, timeInterval.length -1);
		}
		if (timeInterval === 'week' && switchRepeats === 'repeat'){
			return (
				<div className="catchUp">
					<div onClick={this.props.catchUp} data-id="fixed" className="menu"><div className="small-radio-button"><div className={classnames('small-radio-inside', {
						'selected' : repeatCarry === 'fixed'
					})}></div></div><span>Fixed</span></div>
					<div onClick={this.props.catchUp} data-id="push" className="menu"><div className="small-radio-button"><div className={classnames('small-radio-inside', {
						'selected' : repeatCarry === 'push'
					})}></div></div><span>Push</span></div>
				</div>
			);
		}
	}
	render() {
		const { activeRepeatRadio } = this.props;
		return (
			<div>
				Ends
				<div className="endsWrap">
					<div className="radio neverEnds">
						<label>
							<div
								className="radio-button"
								onClick={this.props.handleRadio}
								data-name="never"
							>
								<div
									className={classnames({
										'radio-inside': activeRepeatRadio === 'never'
									})}
								/>
							</div>
							<span className="choiceSelect">Never</span>
						</label>
					</div>
					{(activeRepeatRadio === 'never') ? this.catchUp() : null }
					<div className="radio datePicker">
						<label>
							<div
								className="radio-button"
								onClick={this.props.handleRadio}
								data-name="on"
							>
								<div
									className={classnames({
										'radio-inside': activeRepeatRadio === 'on'
									})}
								/>
							</div>
							<span className="choiceSelect">On</span>
						</label>
						<DayPickerInput
							overlayComponent={CustomOverlay}
							selectedDay={new Date(this.props.calendar.startDate)}
							keepFocus={false}
							formatDate={formatDate}
							parseDate={parseDate}
							format="L"
							onDayChange={this.props.handleCal}
							placeholder={`${formatDate(
								new Date(this.props.calendar.startDate),
								'L',
								'en-gb'
							)}`}
							dayPickerProps={{
								locale: 'en-gb',
								localeUtils: MomentLocaleUtils
							}}
						/>
					</div>
					{(activeRepeatRadio === 'on') ? this.catchUp() : null }
					<div className="radio afterCompletes">
						<label>
							<div
								className="radio-button"
								onClick={this.props.handleRadio}
								data-name="after"
							>
								<div
									className={classnames({
										'radio-inside': activeRepeatRadio === 'after'
									})}
								/>
							</div>
							<span className="choiceSelect">After</span>
						</label>
						<input
							className="repeatEvery"
							value={this.props.calendar.totalCompletes}
							onChange={this.props.handleCompletes}
						/>
						<div className="repeatCompletes">completes</div>
					</div>
					{(activeRepeatRadio === 'after') ? this.catchUp() : null }
				</div>
			</div>
		);
	}
}
function mapStateToProps({ calendar }) {
	return { calendar };
}
export default connect(mapStateToProps, {handleCompletes, catchUp})(Ends);
