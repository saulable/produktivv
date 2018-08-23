import React, { Component } from 'react';
import { connect } from 'react-redux';
import LeftNavigation from '../../containers/LeftNavigation';
import ProjectAutoSuggest from '../Calendar/ProjectAutoSuggest';

class HatsDashboard extends Component {
	render() {
		return (
			<div>
				<LeftNavigation />
				<div className="container-fluid">
					<div className="card">
						<ProjectAutoSuggest />
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(HatsDashboard);
