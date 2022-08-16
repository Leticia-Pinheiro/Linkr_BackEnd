import {
	createPost,
	getAllPosts,
	getAllPostsFromUser,
	deleteFromLikesQuery,
	deleteFromPostsQuery,
	updateText,
} from "../repositories/timelineRepository.js";

import {
	createHashtag,
	PostByHashtag,
	searchHashtag,
	getAllPostsFromHashtag,
	getTags,
} from "../repositories/hashtagRepository.js";

import {
	searchUserById,
	isPostFromUser,
} from "../repositories/userRepository.js";
import urlMetadata from "url-metadata";

export async function publishPost(req, res) {
	const { url, text } = req.body;
	const { tokenDecoded } = res.locals;
	const hashtag = text.match(/#\w+/g);

	try {
		const urlData = await urlMetadata(url);

		await createPost(
			tokenDecoded.id,
			url,
			text,
			urlData.title,
			urlData.image,
			urlData.description
		);

		if (hashtag) {
			const hashtagArr = hashtag.map((hashtag) => hashtag.slice(1));

			hashtagArr.map((hashtag) => createHashtag(hashtag));

			hashtagArr.map((hashtag) =>
				PostByHashtag(hashtag, tokenDecoded.id, url, text)
			);
		}

		res.sendStatus(201);
	} catch (error) {
		res.sendStatus(500);
	}
}

export async function getPosts(req, res) {
	const { tokenDecoded } = res.locals;

	try {
		const { rows: posts } = await getAllPosts(tokenDecoded.id);
		res.status(200).send(posts);
	} catch (error) {
		res.sendStatus(500);
	}
}

export async function getPostsFromUser(req, res) {
	const { tokenDecoded } = res.locals;
	const { id } = req.params;

	try {
		const { rows: user } = await searchUserById(id);

		if (!user.length) return res.sendStatus(404);

		const { rows: posts } = await getAllPostsFromUser(tokenDecoded.id, id);

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

	try {
		const { rows: infoHashtag } = await searchHashtag(hashtag);

		if (!infoHashtag.length) return res.sendStatus(404);

		const { rows: posts } = await getAllPostsFromHashtag(
			tokenDecoded.id,
			hashtag
		);

		res.status(200).send(posts);
	} catch (error) {
		res.sendStatus(500);
	}
}
