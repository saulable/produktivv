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

import 'moment/locale/en-gb';

class Ends extends Component {
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
				</div>
			</div>
		);
	}
}
function mapStateToProps({ calendar }) {
	return { calendar };
}
export default connect(mapStateToProps)(Ends);
