import { searchUsers } from "../repositories/userRepository.js";

export async function sendUsers(req, res) {
	const { search } = req.query;

	try {
		const { rows: users } = await searchUsers(search);

		res.status(200).send(users);
	} catch (error) {
		res.sendStatus(500);
	}
}