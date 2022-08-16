import { searchUsers } from "../repositories/userRepository.js";

export async function sendUsers(req, res) {
	const { tokenDecoded } = res.locals;
	const { search } = req.query;

	try {
		const { rows: users } = await searchUsers(search, tokenDecoded.id);

		res.status(200).send(users);
	} catch (error) {
		res.sendStatus(500);
	}
}
