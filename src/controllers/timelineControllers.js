import { createPost, getAllPosts } from "../repositories/timelineRepository.js";
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
