import React, { Component } from 'react';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import classnames from 'classnames';
import moment from 'moment';
import {connect} from 'react-redux';
import * as actions from '../../actions/calendarActions';

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
		if (this.props.event.taskType === 'simplelong'){
			return 'top';
		} else {
			if (checkDay === 0 || checkDay === 6 || checkDay === 5){
				return 'left';
			}else {
				return 'right';
			}
		}
	}
	dataItems(className, onClick, textBetween, icon){
		return (
			<div className={className} onClick={onClick}
				data-id={this.props.event._id}
				data-tasktype={this.props.event.taskType}
				data-start_date={this.props.event.start_date}
				data-end_date={this.props.event.end_date}
				data-dailyid={this.props.event.dailyId} >
				{textBetween}<i className={icon}></i>
			</div>
		);
	}
	render() {
		let popoverClickRootClose = (
			<Popover
				id="popover"
				style={{ zIndex: 10000 }}>
				<div className="header">
					<div className="row-icons">
						<div className="icons">
							{this.dataItems('deleteCal', this.props.clickDeleteCal, '', 'far fa-trash-alt' )}
							<i onClick={() => document.body.click()} className="fas fa-times"></i>
						</div>
					</div>
					<div className="title">
						{this.props.title}
					</div>
				</div>
				<div className="taskContent">
					<div className="edit">
						<i className="fas fa-pen"></i>
					</div>
					<div className="details">
						<i className="far fa-clock"></i>
						<span>{moment(this.props.event.start_date).format('HH:MM a')}</span><span> - </span>
						<span>{moment(this.props.event.end_date).format('HH:MM a')}</span><br/>
						<span>{this.props.event.task_duration}</span>
					</div>
					<div className="extra-details">
						<div>Track:</div>
						<div>Hat:</div>
						<div>Note:</div>
					</div>
				</div>
				<div className="complete">
					<div className="buttonComplete">
						{this.dataItems('clickComplete', this.props.clickCompleteCal, 'Complete', 'fas fa-check' )}
					</div>
					<div className="buttonPostpone">
						{this.dataItems('clickPostpone', this.props.clickPostponeCal, 'Postpone', 'fas fa-long-arrow-alt-right' )}
					</div>
				</div>
			</Popover>
		);
		return (
			<div>
				<OverlayTrigger
					id="help"
					className="hello"
					trigger="click"
					rootClose={true}
					placement={this.placement()}
					overlay={popoverClickRootClose}
					title={this.props.title}>
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

function mapStateToProps({calendar}){
	return {calendar};
}
export default connect(mapStateToProps, actions)(CustomEvent);
