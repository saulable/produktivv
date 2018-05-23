import React, { Component } from 'react';
import { connect } from 'react-redux';

import FlashMessage from './FlashMessages';

class FlashMessageList extends Component {
	render() {
		const messages = this.props.messages.map(message => {
			return <FlashMessage
				key={message.id}
				message={message}
				deleteFlashMessage={this.props.deleteFlashMessage}
			/>;
		});
		return <div>{messages}</div>;
	}
}

const mapStateToProps = state => ({
	messages: state.flashMessages
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(FlashMessageList);
