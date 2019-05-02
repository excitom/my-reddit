import fetch from "cross-fetch";

import {
	SELECT_SUBREDDIT,
	INVALIDATE_CACHE,
	REQUEST_POSTS,
	RECEIVE_POSTS,
	RECEIVE_POPULAR,
	REDDIT_URL
} from "./constants";

export function selectSubreddit(subreddit) {
	return {
		type: SELECT_SUBREDDIT,
		subreddit
	};
}

export function invalidateCache(subreddit) {
	return {
		type: INVALIDATE_CACHE,
		subreddit
	};
}

export function requestPosts(subreddit) {
	return {
		type: REQUEST_POSTS,
		subreddit
	};
}

function receivePosts(subreddit, json) {
	return {
		type: RECEIVE_POSTS,
		subreddit,
		posts: json.data.children.map(child => child.data),
		receivedAt: Date.now(),
		before: json.data.before,
		after: json.data.after
	};
}

function fetchPosts(subreddit, next, target) {
	let modifier = "";
	if (target) {
		if (next) {
			modifier = "after=" + target;
		} else {
			modifier = "before=" + target;
		}
	}

	return dispatch => {
		dispatch(requestPosts(subreddit));
		return fetch(`${REDDIT_URL}/r/${subreddit}.json?${modifier}`)
			.then(response => response.json())
			.then(json => dispatch(receivePosts(subreddit, json)));
	};
}

function shouldFetchPosts(state, subreddit) {
	const posts = state.postsBySubreddit[subreddit];
	if (!posts) {
		return true;
	} else if (posts.isFetching) {
		return false;
	} else {
		return posts.didInvalidate;
	}
}

export function fetchPostsIfNeeded(subreddit, next = null, target = null) {
	return (dispatch, getState) => {
		if (shouldFetchPosts(getState(), subreddit)) {
			return dispatch(fetchPosts(subreddit, next, target));
		}
	};
}

export function fetchPopularSubreddits() {
	return dispatch => {
		return fetch(`${REDDIT_URL}/r/popular.json`)
			.then(response => response.json())
			.then(json => dispatch(receivePopular(json)));
	};
}

function receivePopular(json) {
	const items = json.data.children.map(child => child.data);
	return {
		type: RECEIVE_POPULAR,
		popular: items.map(item => item.subreddit)
	};
}
