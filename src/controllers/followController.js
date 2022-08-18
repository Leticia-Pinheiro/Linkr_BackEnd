import {
	createFollow,
	isFollowing,
	unfollow,
} from "../repositories/followRepository.js";

export async function newFollower(req, res) {
	const { tokenDecoded } = res.locals;
	const id = parseInt(req.body.id);

	try {
		const { rows: alreadyFollowing } = await isFollowing(tokenDecoded.id, id);

		if (alreadyFollowing.length) {
			await unfollow(tokenDecoded.id, id);
			return res.sendStatus(200);
		}

		await createFollow(tokenDecoded.id, id);

		res.sendStatus(200);
	} catch (error) {
		res.sendStatus(500);
	}
}
