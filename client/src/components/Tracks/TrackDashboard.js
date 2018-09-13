import React, { Component } from 'react';
// import { connect } from 'react-redux';
import LeftNavigation from '../../containers/LeftNavigation';
import Resizable from 're-resizable';
import TrackTree from './TrackTree';
import TrackView from './TrackView';
class TracksDashboard extends Component {
	render() {
		return (
			<div className="container">
				<LeftNavigation />
				<div className="content-x no-padding">
					<Resizable
						defaultSize={{
							width: 150
						}}
						enable={{ top:false, right:true, bottom:false, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
						className="treeView"
					>
						<TrackTree />
					</Resizable>
					<div className="trackView">
						<div className="content-x">
						<TrackView />
					</div>
					</div>
				</div>
			</div>
		);
	}
}
export default TracksDashboard;
