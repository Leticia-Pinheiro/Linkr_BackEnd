import {
	countCommentsQuery,
	getComments,
	postCommentQuery,
} from "../repositories/commentRepository.js";

export async function countComments(req, res) {
	const { id } = req.params;
	const { tokenDecoded } = res.locals;

	try {
		const { rows: count } = await countCommentsQuery(id);

		const { rows: comments } = await getComments(id, tokenDecoded.id);

		res.status(200).send({ count: count[0].totalComments, comments });
	} catch (error) {
		res.sendStatus(500);
	}
}

export async function postComment(req, res) {
	const { tokenDecoded } = res.locals;
	const data = req.body;

	try {
		await postCommentQuery(data.comment, tokenDecoded.id, data.postId);

		res.sendStatus(201);
	} catch (error) {
		res.sendStatus(500);
	}
}
