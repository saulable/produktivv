			<div className="card-header">
				<ul className="nav nav-tabs card-header-tabs">
					<li className="nav-item">
						<a
							onClick={() => this.props.onClickNotes('journal')}
							className={classnames('nav-link', {
								active: this.props.notes.tab === 'journal' ? true : false
							})}
						>
							Daily Journal
						</a>
					</li>
					<li className="nav-item">
						<a
							onClick={() => this.props.onClickNotes('notes')}
							className={classnames('nav-link', {
								active: this.props.notes.tab === 'notes' ? true : false
							})}
						>
							Notes
						</a>
					</li>
				</ul>
			</div>
			<textarea
				onChange={this.journalChange.bind(this)}
				className={classnames('notes-box', {
					'd-none': this.props.notes.tab === 'journal' ? false : true
				})}
				name="dailyj"
				value={this.props.notes.journalmessage}
				data-id={this.props.notes.journalid}
			/>
			<textarea
				onChange={this.noteChange.bind(this)}
				className={classnames('notes-box comments-notes', {
					'd-none': this.props.notes.tab === 'notes' ? false : true
				})}
				name="note"
				data-id={this.props.notes.id}
				value={this.props.notes.note}
			/>
		</div>
