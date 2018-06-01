import React, { Component } from 'react';
import TextFieldGroup from '../../containers/TextFieldGroup';
import DailyTasksList from './DailyTasksList';
import { connect } from 'react-redux';
import {
	newTaskRequest,
	onClickNotes,
	handleNoteChange,
	saveNoteChange,
	handleJournalChange
} from '../../actions/taskActions';
import classnames from 'classnames';

class Entries extends Component {
	constructor(props) {
		super(props);
		this.state = {
			message: '',
			note: '',
			notes_show: true,
			journal: '',
			name: '',
			typing: false,
			typingTimeOut: 0
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.noteChange = this.noteChange.bind(this);
	}
	noteChange(e) {
		e.preventDefault();
		const {value, name} = e.target;
		const id = e.currentTarget.dataset.id;
		this.props.handleNoteChange({ data: value, id });
		this.autoSave(value, id, name);
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
			}, 500)
		});
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}
	onSubmit(e) {
		e.preventDefault();
		this.props.newTaskRequest(this.state).then(res => {
			this.setState({ message: '' });
		});
	}
	render() {
		return (
			<div className="wrapper journal-content">
				<div className="container-fluid">
					<div className="row">
						<div className="input-box col-12">
							<form onSubmit={this.onSubmit} className="tasks">
								<TextFieldGroup
									field="message"
									label="Daily Task"
									placeholder="enter your daily task here"
									onChange={this.onChange}
									value={this.state.message}
								/>
							</form>
						</div>
					</div>
					<div className="row tasks-notes">
						<div className="must-complete col-8">
							<DailyTasksList />
						</div>
						<div className="card notes-card col-4">
							<div className="card-header">
								<ul className="nav nav-tabs card-header-tabs">
									<li className="nav-item">
										<a
											onClick={() => this.props.onClickNotes('journal')}
											className={classnames('nav-link', {
												active: (this.props.notes.tab == 'journal') ? true : false
											})}
											href="#"
										>
											Daily Journal
										</a>
									</li>
									<li className="nav-item">
										<a
											onClick={() => this.props.onClickNotes('notes')}
											className={classnames('nav-link', {
												active: (this.props.notes.tab == 'notes') ? true : false
											})}
											href="#"
										>
											Notes
										</a>
									</li>
								</ul>
							</div>
							<textarea
								onChange={this.journalChange.bind(this)}
								className={classnames('notes-box', {
									'd-none': (this.props.notes.tab == 'journal') ? false : true
								})}
								name="dailyj"
								value={this.props.notes.journalmessage}
								data-id={this.props.notes.journalid}
							/>
							<textarea
								onChange={this.noteChange.bind(this)}
								className={classnames('notes-box comments-notes', {
									'd-none': (this.props.notes.tab == 'notes') ? false : true
								})}
								name="note"
								data-id={this.props.notes.id}
								value={this.props.notes.note}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps({ notes }) {
	return { notes };
}

export default connect(mapStateToProps, {
	newTaskRequest,
	onClickNotes,
	handleNoteChange,
	saveNoteChange,
	handleJournalChange
})(Entries);
