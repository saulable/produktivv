import React, { Component } from 'react';
import { connect } from 'react-redux';
import LeftNavigation from '../../containers/LeftNavigation';
import Resizable from 're-resizable';
import TrackTree from './TrackTree';

class TracksDashboard extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="container">
				<LeftNavigation />
				<div className="content-x no-padding">
					<Resizable
						defaultSize={{
							width: 200
						}}
						enable={{ top:false, right:true, bottom:false, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
						className="treeView"
					>
						<TrackTree />
					</Resizable>
				</div>
			</div>
		);
	}
}
export default TracksDashboard;
