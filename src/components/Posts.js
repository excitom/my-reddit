import React, { Component } from "react";
import PropTypes from "prop-types";
import { REDDIT_URL } from "../constants";

export default class Posts extends Component {
	timeDiff = t => {
		let diff = Math.floor(Date.now() / 1000) - t;
		let unit = "";
		if (diff < 60) {
			unit = " second";
		}
		diff = Math.floor(diff / 60);
		if (diff < 60) {
			unit = " minute";
		}
		diff = Math.floor(diff / 60);
		unit = " hour";
		if (diff > 1) {
			unit += "s";
		}
		return diff + unit;
	};

	render = () => {
		return (
			<ul>
				{this.props.posts.map((post, i) => (
					<li key={i}>
						<div>
							<a
								href={post.url}
								target="_new"
								className="PostTitle"
							>
								{post.thumbnail === "self" || (
									<img
										src={post.thumbnail}
										className="Thumbnail"
										alt="thumbnail"
									/>
								)}
								{post.title}
							</a>
						</div>
						<div className="Clear" />
						<div className="Author">
							Submitted {this.timeDiff(post.created)} ago by{" "}
							<span className="AuthorName">{post.author}</span>
						</div>
						<div className="Comments">
							{post.num_comments}{" "}
							<a
								href={REDDIT_URL + post.permalink}
								className="CommentLink"
								target="_new"
							>
								Comments
							</a>
						</div>
					</li>
				))}
			</ul>
		);
	};
}

Posts.propTypes = {
	posts: PropTypes.array.isRequired
};
