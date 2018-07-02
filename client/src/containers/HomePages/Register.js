import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { addFlashMessage } from '../../actions/flashMessages';

class Register extends Component {
	constructor() {
		super();
		this.state = {
			username: '',
			password: '',
			errors: ''
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}
	onChange({ target: { name, value } }) {
		this.setState({ [name]: value });
	}
	onSubmit(event) {
		event.preventDefault();
		const { username, password } = this.state;
		axios.post('/api/auth/register', { username, password }).then(
			res => {
				if (res.data.success) {
					this.props.addFlashMessage({
						type: 'success',
						text: ' You signed up successfully, please login!'
					});
					this.props.history.push('/login');
				} else {
					this.setState({ errors: res.data.msg });
				}
			},
			err => {
				this.setState({ errors: err.response.data });
			}
		);
	}
	render() {
		const { username, password, errors } = this.state;
		return (
			<div className="login-form-bg">
				<div className="login-form">
					<div className="login-form-inner">
						{errors ? <div className="callout warning">{errors} </div> : ''}
						<div class="form-sign-wrapper">
							<form className="form-signin" onSubmit={this.onSubmit}>
								<h4 className="type-sidelines"><span>Register</span></h4>
								<label className="sr-only">Email address</label>
								<input
									type="email"
									className="form-control"
									placeholder="Email address"
									name="username"
									value={username}
									onChange={this.onChange}
									required
								/>
								<label htmlFor="inputPassword" className="sr-only">
									Password
								</label>
								<input
									type="password"
									className="form-control"
									placeholder="Password"
									name="password"
									value={password}
									onChange={this.onChange}
									required
								/>
								<button
									className="btn btn-lg btn-primary btn-block"
									type="submit"
								>
									Register
								</button>
							</form>
						</div>
					</div>
					<div className="outer-form">
						<span class="password">
							<Link to="login">Back to Login</Link>
						</span>
						<span class="register-here">
							<a href="register" />
						</span>
					</div>
				</div>
			</div>
		);
	}
}
export default connect(
	null,
	{ addFlashMessage }
)(Register);
