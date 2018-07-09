import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import TextareaAutosize from 'react-autosize-textarea';
import * as actions from '../../../actions/taskActions';
import moment from 'moment';

class DailyJournalText extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			typing: false,
			typingTimeOut: 0,
			autosaved: false
		};
		this.handleClose = this.handleClose.bind(this);
	}
	handleClose(e) {
		e.preventDefault();
		this.props.helperPop(null);
	}
	journalChange(e) {
		e.preventDefault();
		const { value, name } = e.target;
		const id = e.currentTarget.dataset.id;
		this.props.handleJournalChange({ data: value });
		this.autoSave(value, id, name);
	}
	autoSave(dataNote, id, name) {
		if (this.state.typingTimeout) {
			clearTimeout(this.state.typingTimeout);
		}
		this.setState({
			name: dataNote,
			typing: false,
			typingTimeout: setTimeout(() => {
				this.props.saveNoteChange({ id, dataNote, name });
			}, 4000)
		});
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.notes.journal_autosaved) {
			this.setState({ autosaved: true });
			this.autoSaveSpan();
			setTimeout(() => {
				this.props.revertAutoSave();
			}, 4000);
		} else {
			this.setState({ autosaved: false });
			this.autoSaveSpan();
		}
	}
	autoSaveSpan() {
		if (this.state.autosaved) {
			const time = moment().format('MMMM Do, h:mm a');
			return <span>Auto saved {time}</span>;
		}
	}
	render() {
		return (
			<div className="dailyText">
				<div className="dailyTextHeader">
					<span>Daily Journal</span>
					<a onClick={this.handleClose} className="close">
						&times;
					</a>
				</div>
				<div className="textArea">
					<TextareaAutosize
						onChange={this.journalChange.bind(this)}
						value={this.props.notes.journalmessage}
						data-id={this.props.notes.journalid}
						name="dailyj"
					/>
				</div>
				<div className="commit-area">
					<div className="autoSave">{this.autoSaveSpan()}</div>
					<button className="commit">
						<span>Commit</span>
					</button>
				</div>
			</div>
		);
	}
}

function mapStateToProps({ notes }) {
	return { notes };
}

const mapDispatchToProps = dispatch => ({});

export default connect(
	mapStateToProps,
	actions
)(DailyJournalText);
