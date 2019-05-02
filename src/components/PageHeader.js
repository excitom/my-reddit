import React, { Component } from "react";
import "../index.css";
import logo from "./logo.png";

class PageHeader extends Component {
	render = () => {
		return (
			<span>
				<small>
					You are running this application in <b>{this.props.env}</b>{" "}
					mode.
				</small>
				<div className="AppHeader">
					<img className="Logo" src={logo} alt="Logo" />
					<h1 className="Salute">Reddit</h1>
				</div>
				<div className="Clear" />
				{this.props.lastUpdated && (
					<p>
						Last update at{" "}
						{new Date(this.props.lastUpdated).toLocaleTimeString()}.
					</p>
				)}
			</span>
		);
	};
}

export default PageHeader;
