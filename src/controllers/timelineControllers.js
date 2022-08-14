import {
	createPost,
	getAllPosts,
	getAllPostsFromUser,
	deleteQuery,
	updateText,
} from "../repositories/timelineRepository.js";
import {
	searchUserById,
	isPostFromUser,
} from "../repositories/userRepository.js";
import urlMetadata from "url-metadata";

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

		await deleteQuery(id);

		res.sendStatus(204);
	} catch (error) {
		res.sendStatus(500);
	}
}

export async function updatePost(req, res) {
	
	const { tokenDecoded } = res.locals;
	const { text } = req.body;
	const { id } = req.params;

	console.log(tokenDecoded, text, id)

	try {
		console.log(1)
		const { rows: postFromUser } = await isPostFromUser(tokenDecoded.id, id);
		console.log(2)
		if (!postFromUser.length) return res.sendStatus(401);
		console.log(3)

		await updateText(id, text);
		console.log(4)

		res.sendStatus(202);
		console.log(5)
	} catch (error) {
		console.log(6)
		res.sendStatus(500);
	}
}
