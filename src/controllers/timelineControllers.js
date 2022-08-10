import { createPost, getAllPosts } from "../repositories/timelineRepository.js";
import urlMetadata from "url-metadata";

export async function publishPost(req, res) {
	const { url, text } = req.body;

	try {
		const urlData = await urlMetadata(url);

		await createPost(
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
