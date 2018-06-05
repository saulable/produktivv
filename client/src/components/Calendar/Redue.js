import React, { Component } from 'react';
import classnames from 'classnames';
import Ends from './Repeats/Ends';
import { connect } from 'react-redux';
import { switchRepeat } from '../../actions/calendarActions';

class Redue extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showRedue: true
		};
		this.updateState = this.updateState.bind(this);
	}
	updateState(e) {
		const name = e.currentTarget.dataset.tag;
		if (this.props.calendar.switchRepeats === 'redue') {
			this.props.switchRepeat(null);
			this.setState({ showRedue: !this.state.showRedue });
		}
		else if (!this.props.calendar.switchRepeats){
			this.props.switchRepeat(name);
			this.setState({ showRedue: !this.state.showRedue });
		}else {
			e.preventDefault();
			alert('It is currently disabled');
		}
	}
	renderRedue() {
		return (
			<div className="switchHeaders">
				<div>
					<span>ReDue</span>
					<label className="switch switch2">
						<input type="checkbox"	data-tag="redue" onClick={this.updateState}/>
						<span className="slider round" />
					</label>
				</div>
				<div
					className={classnames('', {
						'd-none': this.state.showRedue ? true : false
					})}
				>
					<div className="addMarginTop">
						Redue in <input className="repeatEvery" /> days.
					</div>
					<div className="addMarginTop">
						<Ends />
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
	console.log(calendar);
	return { calendar };
}
export default connect(mapStateToProps, { switchRepeat })(Redue);
