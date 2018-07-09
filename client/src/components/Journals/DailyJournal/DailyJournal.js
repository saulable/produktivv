import React, { Component } from 'react';
import LeftNavigation from '../../../containers/LeftNavigation';
import Entries from './Entries';

class DailyJournal extends Component {
	render() {
		return (
			<div className="container">
				<LeftNavigation />
				<div className="content-x">
					<Entries />
				</div>
			</div>
		);
	}
}
export default DailyJournal;
