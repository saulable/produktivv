import React, { Component } from 'react';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import classnames from 'classnames';
import moment from 'moment';

class CustomEvent extends Component {
	constructor(props) {
		super(props);
		this.mydiv = React.createRef();
		this.setTextInputRef = element => {
			this.textInput = element;
		};
		this.state = {
			counter : 0
		};
	}
	componentDidMount(){
		this.setState({counter: this.state.counter++});
		return 'left';
	}
	icons = () => {
		if (this.props.event.completed) {
			return <div className="completedTick" />;
		} else if (this.props.event.taskType === 'simple') {
			return <div className="taskSimpleS" />;
		} else if (this.props.event.taskType === 'repeat') {
			return <div className="taskRepeat" />;
		} else if (this.props.event.taskType === 'redue') {
			return <div className="taskRedue" />;
		} else if (this.props.event.taskType === 'simplelong') {
			if (this.props.event.task_status === 'completed') {
				return <div className="completedTick" />;
			} else if (this.props.event.task_status === 'inprogress') {
				return <div className="inProgress" />;
			} else if (this.props.event.task_status === 'uncomplete') {
				return <div className="taskSimpleS" />;
			}
		}
	};
	placement(e) {
		const checkDay = moment(this.props.event.start_date).clone().day();
		// console.log(moment(this.props.start_date));
		if (checkDay === 0 || checkDay === 6 || checkDay === 5){
			return 'left';
		}else {
			return 'right';
		}
	}
	render() {
		let popoverClickRootClose = (
			<Popover
				style={{ zIndex: 10000 }}>
				<div className="header">
					<div className="row-icons">
						<div className="delete"></div>
						<div className="close"></div>
					</div>
					<div className="title">
						{this.props.title}
					</div>
					<div className="edit">
					</div>
				</div>
				<div className="taskContent">
					<div className="details">
						<span className="task-details">Task Details:</span>
						<span>{this.props.event.start_date}</span>
						<span>{this.props.event.end_date}</span>
						<span>{this.props.event.duration}</span>
					</div>
					<div className="extra-details">
						<div>Track:</div>
						<div>Hat:</div>
						<div>Note:</div>
					</div>
					<div className="complete">Complete</div>
				</div>
			</Popover>
		);
		return (
			<div>
				<OverlayTrigger
					id="help"
					className="hello"
					trigger="click"
					rootClose
					placement={this.placement()}
					overlay={popoverClickRootClose}
					title={this.props.title}
					onEnter={this.test}>
					<div
						className={classnames('hide-x', this.props.event.taskType, {
							completed: this.props.event.completed,
							inprogress_bar: this.props.event.task_status === 'inprogress'
						})}>
						{this.icons()}
						<div className="message">{this.props.title}</div>
					</div>
				</OverlayTrigger>
			</div>
		);
	}
}

export default CustomEvent;
