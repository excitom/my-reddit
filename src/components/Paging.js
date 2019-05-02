import React, { Component } from "react";
import "../index.css";

class Paging extends Component {
	handlePrevClick = e => {
		e.preventDefault();
		this.props.handlePrev(this.props.before);
	};

	handleNextClick = e => {
		e.preventDefault();
		this.props.handleNext(this.props.after);
	};

	render = () => {
		return (
			<div>
				{this.props.before && (
					<button
						className="PagingButtons"
						onClick={this.handlePrevClick}
					>
						&lt; Previous
					</button>
				)}
				{this.props.after && (
					<button
						className="PagingButtons"
						onClick={this.handleNextClick}
					>
						Next &gt;
					</button>
				)}
			</div>
		);
	};
}

export default Paging;
