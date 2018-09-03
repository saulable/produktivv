import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/trackActions';
import SortableList from './SortableList';

class TrackView extends Component {
	componentDidMount() {
		this.props.initTrackView();
	}
	render() {
		return (
			<div className="must-complete">
				<div className="dailyTaskList">
					<div className="collapse">
						<div className="collapse-header">{this.props.tracks.projectHeader}</div>
					</div>
					<div>
						<SortableList
							items={this.props.tracks.trackView}
							onSortEnd={this.onSortEnd}
							helperClass="SortableHelper"
							useDragHandle={true}
						/>
					</div>
				</div>
			</div>
		);
	}
}
function mapStateToProps({tracks}){
	return {tracks};
}
export default connect(
	mapStateToProps,
	actions
)(TrackView);
