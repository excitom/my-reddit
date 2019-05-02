import React, { Component } from "react";
import PropTypes from "prop-types";

export default class PickSubreddit extends Component {
	render = () => {
		const { value, onChange, options } = this.props;

		return (
			<span>
				<label>Pick new subreddit: </label>
				<select onChange={e => onChange(e.target.value)} value={value}>
					<option value="">-- pick one --</option>
					{options.map(option => (
						<option value={option} key={option}>
							{option}
						</option>
					))}
				</select>
				<h3>SubReddit: {value}</h3>
			</span>
		);
	};
}

PickSubreddit.propTypes = {
	options: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired
};
