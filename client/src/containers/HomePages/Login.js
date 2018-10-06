import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { login, facebookLogin } from '../../actions/authActions';
// import FaceBookLogin from './FaceBookLogin';
import FlashMessageList from '../FlashMessageList';
import { addFlashMessage } from '../../actions/flashMessages';

class Login extends Component {
	constructor() {
		super();
		this.state = {
			username: '',
			password: '',
			message: '',
			isLoading: false
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}
	onChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}
	onSubmit(event) {
		event.preventDefault();
		// const { username, password } = this.state;
		// check the validation here
		this.props
			.login(this.state)
			.then(
				res => this.props.history.push('/home'),
				err =>
					this.setState({ message: err.response.data.errors, isLoading: false })
			);
	}
	render() {
		const { username, password, message } = this.state;
		return (
			<div className="login-form-bg">
				<div className="login-form">
					<div className="login-form-inner">
						<FlashMessageList />
						<div className="form-sign-wrapper">
							<form className="form-signin" onSubmit={this.onSubmit}>
								{message !== '' && (
									<div
										className="alert alert-warning alert-dismissible"
										role="alert"
									>
										{message}
									</div>
								)}
								<h4 className="type-sidelines"><span>Sign In Here</span></h4>
								<div className="field">
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
								</div>
								<div className="field">
									<label className="sr-only">Password</label>
									<input
										type="password"
										className="form-control"
										placeholder="Password"
										name="password"
										value={password}
										onChange={this.onChange}
										required
									/>
								</div>
								<button className="submit-button" type="submit">
									Login
								</button>
								<h4 className="type-sidelines">
									<span>Or</span>
								</h4>
								<div className="facebook-wrap">
									<a href="/auth/facebook"><div className="facebookLogin">Login with FaceBook</div></a>
								</div>
							</form>
						</div>
					</div>
					<div className="outer-form">
					<span className="password"><Link to="password">Forgot password?</Link></span>
					<span className="register-here"><Link to="register">Don't have an account?</Link></span>
				</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return state;
}
export default connect(
	mapStateToProps,
	{ login, facebookLogin, addFlashMessage }
)(Login);
