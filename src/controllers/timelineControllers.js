import urlMetadata from "url-metadata";

import {
	createPost,
	getAllPosts,
	getAllPostsFromUser,
	deleteFromLikesQuery,
	deleteFromPostsQuery,
	updateText,
	recentPosts,
} from "../repositories/timelineRepository.js";

import {
	createHashtag,
	PostByHashtag,
	searchHashtag,
	getAllPostsFromHashtag,
	getTags,
	deleteFromHashtagQuery,
} from "../repositories/hashtagRepository.js";

import {
	searchUserById,
	isPostFromUser,
} from "../repositories/userRepository.js";

import { followersFromUser } from "../repositories/followRepository.js";

export async function publishPost(req, res) {
	const { url, text } = req.body;
	const { tokenDecoded } = res.locals;
	const hashtag = text.match(/#\w+/g);

	try {
		const urlData = await urlMetadata(url);

		const { rows: idFromNewPost } = await createPost(
			tokenDecoded.id,
			url,
			text,
			urlData.title,
			urlData.image,
			urlData.description
		);

		if (hashtag) {
			const hashtagArr = await hashtag.map((hashtag) => hashtag.slice(1));

			await hashtagArr.forEach(async (hashtag) => await createHashtag(hashtag));

			await hashtagArr.forEach(
				async (hashtag) => await PostByHashtag(hashtag, idFromNewPost[0].id)
			);
		}

		res.sendStatus(201);
	} catch (error) {
		res.sendStatus(500);
	}
}

export async function getPosts(req, res) {
	const { tokenDecoded } = res.locals;
	const { page } = req.query;

	try {
		const { rows: posts } = await getAllPosts(tokenDecoded.id, page);

		const { rows: followers } = await followersFromUser(tokenDecoded.id);

		res.status(200).send({ posts, followers });
	} catch (error) {
		res.sendStatus(500);
	}
}

export async function getPostsFromUser(req, res) {
	const { tokenDecoded } = res.locals;
	const { id } = req.params;
	const { page } = req.query;

	try {
		const { rows: user } = await searchUserById(id);

		if (!user.length) return res.sendStatus(404);

		const { rows: posts } = await getAllPostsFromUser(
			tokenDecoded.id,
			id,
			page
		);

		res.status(200).send(posts);
	} catch (error) {
		res.sendStatus(500);
	}
}

export async function deletePost(req, res) {
	const { tokenDecoded } = res.locals;
	const { id } = req.params;

	try {
		const { rows: postFromUser } = await isPostFromUser(tokenDecoded.id, id);

		if (!postFromUser.length) return res.sendStatus(401);

		await deleteFromLikesQuery(id);

		await deleteFromHashtagQuery(id);

		await deleteFromPostsQuery(id);

		res.sendStatus(204);
	} catch (error) {
		res.sendStatus(500);
	}
}

export async function updatePost(req, res) {
	const { tokenDecoded } = res.locals;
	const { text } = req.body;
	const { id } = req.params;

	try {
		const { rows: postFromUser } = await isPostFromUser(tokenDecoded.id, id);

		if (!postFromUser.length) return res.sendStatus(401);

		await updateText(id, text);

		res.sendStatus(202);
	} catch (error) {
		res.sendStatus(500);
	}
}

export async function getHashtags(req, res) {
	try {
		const { rows: hashtags } = await getTags();

		res.status(200).send(hashtags);
	} catch (error) {
		res.sendStatus(500);
	}
}

export async function getPostsFromHashtag(req, res) {
	const { tokenDecoded } = res.locals;
	const { hashtag } = req.params;
	const { page } = req.query;

	try {
		const { rows: infoHashtag } = await searchHashtag(hashtag);

		if (!infoHashtag.length) return res.sendStatus(404);

		const { rows: posts } = await getAllPostsFromHashtag(
			tokenDecoded.id,
			hashtag,
			page
		);

		res.status(200).send(posts);
	} catch (error) {
		res.sendStatus(500);
	}
}

export async function getRecentPosts(req, res) {
	const { tokenDecoded } = res.locals;
	const { lastPostCreatedAt } = req.body;

	try {
		
		const { rows: posts } = await recentPosts(
			tokenDecoded.id,
			lastPostCreatedAt
		);
		
		posts.pop();
		
		res.status(200).send(posts);
	} catch (error) {
		res.sendStatus(500);
	}
}
