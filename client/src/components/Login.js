import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import '../styles/login.css';
import {login, facebookLogin} from '../actions/authActions';
import FlashMessageList from '../containers/FlashMessageList';
import { addFlashMessage} from '../actions/flashMessages';

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
		this.props.login(this.state).then(
			(res) => this.props.history.push('/home'),
			(err) => this.setState({message: err.response.data.errors, isLoading: false})
		);
	}
	render() {
		const { username, password, message } = this.state;
		return (
			<div className="container">
				<FlashMessageList />
				<form className="form-signin" onSubmit={this.onSubmit}>
					{message !== '' && (
						<div className="alert alert-warning alert-dismissible" role="alert">
							{message}
						</div>
					)}
					<h5 className="form-siginin-heading">Please sign in</h5>
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
					<button className="btn btn-lg btn-primary btn-block" type="submit">
						Login
					</button>
					<p>
						Not a member?{' '}
						<Link to="/register">
							<span
								className="glyphicon glyphicon-plus-sign"
								aria-hidden="true"
							/>{' '}
							Register here
						</Link>
					</p>
				</form>
				<div className="facebook-login">
					<a href="/auth/facebook">Login with Facebook</a>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state){
	return state;
}
export default connect(mapStateToProps, {login, facebookLogin, addFlashMessage})(Login);
