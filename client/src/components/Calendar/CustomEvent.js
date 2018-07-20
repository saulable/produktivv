import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import moment from 'moment';

class CustomEvent extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let popoverClickRootClose = (
			<Popover
				title={this.props.title}
				id="popover-positioned-top"
				style={{ zIndex: 10000 }}
			>
				<div className="quickFunctions">
					<div className="dateStart edit">E</div>
					<div className="dateStart delete">D</div>
					<div className="dateStart complete">C</div>
				</div>
			</Popover>
		);

		return (
			<div>
				<OverlayTrigger
					id="help"
					trigger="click"
					rootClose
					placement="top"
					overlay={popoverClickRootClose}
					title={this.props.title}
				>
					<div className="hide-x">{this.props.title}</div>
				</OverlayTrigger>
			</div>
		);
	}
}

export default CustomEvent;
