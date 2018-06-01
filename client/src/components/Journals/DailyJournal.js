import React, { Component } from 'react';
import LeftNavigation from '../../containers/LeftNavigation';
import Entries from './Entries';

class DailyJournal extends Component {
	render() {
		return (
			<div>
				<LeftNavigation />
				<Entries />
			</div>
		);
	}
}
export default DailyJournal;
