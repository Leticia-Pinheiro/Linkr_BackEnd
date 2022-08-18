import {
	repostQuery,
	countRepostQuery,
} from "../repositories/repostRepository.js";

export async function repost(req, res) {
	const data = req.body;

	try {
		await repostQuery(data.name, data.userId, data.postId);

		res.sendStatus(201);
	} catch (error) {
		res.sendStatus(500);
	}
}

export async function countRepost(req, res) {
	const { id } = req.params;

	try {
		const { rows: quant } = await countRepostQuery(id);

		res.status(200).send(quant[0].total);
	} catch (error) {
		res.sendStatus(500);
	}
}
