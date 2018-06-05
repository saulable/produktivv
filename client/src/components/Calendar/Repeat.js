import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import { taskDays } from './Days.js';
import {switchRepeat} from '../../actions/calendarActions';
import Ends from './Repeats/Ends.js';

class Repeat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showRepeatDays: true,
			showRedue: true
		};
		this.updateState = this.updateState.bind(this);
	}
	updateState(e) {
		const name = e.currentTarget.dataset.tag;
		if (this.props.calendar.switchRepeats === 'repeat') {
			this.props.switchRepeat(null);
			this.setState({ showRepeatDays: !this.state.showRepeatDays });
		}
		else if (!this.props.calendar.switchRepeats){
			this.props.switchRepeat(name);
			this.setState({ showRepeatDays: !this.state.showRepeatDays });
		}else {
			e.preventDefault();
			alert('It is currently disabled');
		}
	}
	render() {
		return (<div className="switchHeaders">
			<div>
				<span>Repeat</span>
				<label className="switch">
					<input type="checkbox" data-tag="repeat" onClick={this.updateState}/>
					<span className="slider round" />
				</label>
			</div>
			<div
				className={classnames('box', {
					'd-none': this.state.showRepeatDays ? true : false
				})}
			>
				<div>
					Repeat every <input className="repeatEvery" type="text" />
					<div className="dropdown show">
						<a
							className="btn btn-secondary dropdown-toggle"
							href="#"
							role="button"
							id="dropdownMenuLink"
							data-toggle="dropdown"
							aria-haspopup="true"
							aria-expanded="false"
						>
							Week
						</a>
						<div
							className="dropdown-menu dropdownRepeat"
							aria-labelledby="dropdownMenuLink"
						>
							<a className="dropdown-item" href="#">
								Action
							</a>
							<a className="dropdown-item" href="#">
								Another action
							</a>
							<a className="dropdown-item" href="#">
								Something else here
							</a>
						</div>
					</div>
				</div>
				<div className="addMarginTop">
					Repeat on<br /> <div className="btn-group">{taskDays}</div>
				</div>
				<div className="addMarginTop">
					<Ends />
				</div>
			</div>
		</div>);
	}
}

function mapStateToProps({calendar}){
	return {calendar};
}

export default connect(mapStateToProps, { switchRepeat })(Repeat);
