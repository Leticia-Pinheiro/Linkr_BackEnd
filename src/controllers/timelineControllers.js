import {
	createPost,
	getAllPosts,
	getAllPostsFromUser,
	deleteQuery,
} from "../repositories/timelineRepository.js";
import { searchUserById } from "../repositories/userRepository.js";
import urlMetadata from "url-metadata";
import { searchUserById } from "../repositories/userRepository.js";

export async function publishPost(req, res) {
	const { url, text } = req.body;
	const { tokenDecoded } = res.locals;

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

		res.sendStatus(201);
	} catch (error) {
		res.sendStatus(500);
	}
}

export async function getPosts(req, res) {
	try {
		const { rows: posts } = await getAllPosts();

		res.status(200).send(posts);
	} catch (error) {
		res.sendStatus(500);
	}
}


export async function getPostsFromUser(req, res) {
	const { id } = req.params;

	try {
		const { rows: user } = await searchUserById(id);

		if (!user.length) return res.sendStatus(404);

		const { rows: posts } = await getAllPostsFromUser(id);

		res.status(200).send(posts);
	} catch (error) {
		res.sendStatus(500);
	}
}

export async function deletePost(req, res) {
	const { tokenDecoded } = res.locals;
	const { id } = req.params;

	try {
		const { rows: postFromUser } = await searchUserById(tokenDecoded.id, id);

		if (!postFromUser.length) return res.sendStatus(401);

		await deleteQuery(id);

		res.sendStatus(204);
	} catch (error) {
		res.sendStatus(500);
	}
}
