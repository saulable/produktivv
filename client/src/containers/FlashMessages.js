import React, { Component } from 'react';
import classnames from 'classnames';

class FlashMessage extends Component {
	render() {
		const { type, text } = this.props.message;
		return (
			<div
				className={classnames('callout ', {
					'success': type === 'success',
					'warning': type === 'error'
				})}
			>
				{text}
			</div>
		);
	}
}

export default FlashMessage;
