import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import anime from 'animejs';
import {fireworks} from './utils/fireworks';

class Main extends Component {
	componentDidMount(){
		fireworks();
	}

	render() {
		return (
			<header class="site-header homepage">
				<div class="header-content">
					<div class="top-section">
						<div class="logo">
							<h3 class="logo-img"> No Logo </h3>
						</div>
						<div class="menus">
							<nav class="main-navigation">
								<li>
									<a href="/">Home</a>
								</li>
								<li>
									<a href="index.html">How it Works</a>
								</li>
								<li>
									<a href="login">Login</a>
								</li>
								<li>
									<a href="register">Sign Up</a>
								</li>
							</nav>
						</div>
					</div>
					<div class="bottom-section">
						<div class="home-page-container">
							<div class="slogan">
								<div class="intro-title">
									<h3>Time to get Produktivv</h3>
								</div>
								<div class="intro-subtitle">
									<p>Time to start getting productive</p>
								</div>
							</div>
						</div>
						<div class="hold-me">
							<canvas class="fireworks" />
						</div>
					</div>
				</div>
			</header>
		);
	}
}
export default Main;
