import React, { Component } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import MomentLocaleUtils, {
	formatDate,
	parseDate
} from 'react-day-picker/moment';

class Ends extends Component {
	render() {
		return (
			<div>
				Ends
				<div className="radio">
					<label>
						<input type="radio" name="optradio" />Never
					</label>
				</div>
				<div className="radio datePicker">
					<label>
						<input type="radio" name="optradio" />On
					</label>
					<DayPickerInput
						formatDate={formatDate}
						parseDate={parseDate}
						placeholder={`${formatDate(new Date())}`}
					/>
				</div>
				<div className="radio ">
					<label>
						<input type="radio" name="optradio" />After
					</label>
					<input className="repeatEvery" />
					<div className="repeatCompletes">completes</div>
				</div>
			</div>
		);
	}
}
export default Ends;
