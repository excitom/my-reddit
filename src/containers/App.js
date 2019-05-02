import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
	selectSubreddit,
	fetchPostsIfNeeded,
	invalidateCache,
	fetchPopularSubreddits
} from "../actions";
import PickSubreddit from "../components/PickSubreddit";
import Posts from "../components/Posts";
import PageHeader from "../components/PageHeader";
import Paging from "../components/Paging";

class App extends Component {
	componentDidMount = () => {
		const { dispatch, selectedSubreddit } = this.props;
		dispatch(fetchPostsIfNeeded(selectedSubreddit));
		dispatch(fetchPopularSubreddits());
		this.timerId = setInterval(() => this.refresh(), 1000 * 60);
	};

	componentDidUpdate = prevProps => {
		if (this.props.selectedSubreddit !== prevProps.selectedSubreddit) {
			const { dispatch, selectedSubreddit } = this.props;
			dispatch(fetchPostsIfNeeded(selectedSubreddit));
		}
	};

	componentWillUnmount = () => {
		clearInterval(this.timerId);
	};

	handleChange = nextSubreddit => {
		this.props.dispatch(selectSubreddit(nextSubreddit));
		this.props.dispatch(fetchPostsIfNeeded(nextSubreddit));
	};

	handleRefreshClick = e => {
		e.preventDefault();
		this.refresh();
	};

	refresh = () => {
		const target = this.props.selectedSubreddit;
		const next = true;
		this.handleRefresh(next, target);
	};

	handlePrev = target => {
		const next = true;
		this.handleRefresh(next, target);
	};

	handleNext = target => {
		const next = false;
		this.handleRefresh(next, target);
	};

	handleRefresh = (next, target) => {
		const { dispatch, selectedSubreddit } = this.props;
		dispatch(invalidateCache(selectedSubreddit));
		dispatch(fetchPostsIfNeeded(selectedSubreddit, next, target));
	};

	render = () => {
		const {
			selectedSubreddit,
			popularSubreddits,
			posts,
			isFetching,
			lastUpdated,
			before,
			after
		} = this.props;

		const popular = popularSubreddits.popular
			? popularSubreddits.popular
			: ["all"];

		return (
			<div>
				<PageHeader
					lastUpdated={lastUpdated}
					env={process.env.NODE_ENV}
				/>
				<PickSubreddit
					value={selectedSubreddit}
					onChange={this.handleChange}
					options={popular}
				/>
				<p>
					{!isFetching && (
						<button onClick={this.handleRefreshClick}>
							Refresh
						</button>
					)}
				</p>
				{isFetching && posts.length === 0 && <h2>Loading ...</h2>}
				{!isFetching && posts.length === 0 && <h2>Empty</h2>}
				{posts.length > 0 && (
					<div style={{ opacity: isFetching ? 0.5 : 1 }}>
						<Posts posts={posts} />
					</div>
				)}
				<Paging
					before={before}
					after={after}
					handlePrev={this.handlePrev}
					handleNext={this.handleNext}
				/>
			</div>
		);
	};
}

App.propTypes = {
	selectedSubreddit: PropTypes.string.isRequired,
	posts: PropTypes.array.isRequired,
	isFetching: PropTypes.bool.isRequired,
	lastUpdated: PropTypes.number,
	dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
	const { selectedSubreddit, postsBySubreddit, popularSubreddits } = state;
	const {
		isFetching,
		lastUpdated,
		items: posts,
		before,
		after
	} = postsBySubreddit[selectedSubreddit] || {
		isFetching: true,
		items: []
	};

	return {
		selectedSubreddit,
		popularSubreddits,
		posts,
		isFetching,
		lastUpdated,
		before,
		after
	};
};

export default connect(mapStateToProps)(App);
