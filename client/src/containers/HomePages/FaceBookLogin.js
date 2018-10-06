import React, { Component } from 'react';
// import io from 'socket.io-client';
// import OAuth from './OAuth';
/* global process */
import { API_URL } from './config';
// const socket = io.connect(API_URL);

class FaceBookLogin extends Component {
	state = {
		loading: true
	};
	componentDidMount() {
		fetch(`${API_URL}/wake-up`).then(res => {
			if (res.ok) {
				return this.setState({ loading: false });
			}
		});
	}
	render() {
		// const buttons = (providers, socket) =>
		// 	providers.map(provider => (
		// 		<OAuth provider={facebook} key={provider} socket={socket} />
		// 	));
		return (
			<div className={'wrapper'}>
				<div className={'container'}>
					<div className="facebook-wrap">
						{/* <div className="facebookLogin"><OAuth provider={'facebook'} key={'facebook'} socket={socket} />Login with FaceBook</div> */}
					</div>
				</div>
			</div>
		);
	}
}
export default FaceBookLogin;
