import { searchUser } from "../repositories/userRepository.js";
import { singup } from "../repositories/authRepository.js";
import { generateToken } from "../middlewares/generateToken.js";

export async function signupUser(req, res) {
	const data = req.body;

	try {
		const { rows: user } = await searchUser(data.email);

		if (user.length) return res.status(409).send("Usuário já cadastrado!");

		await singup(data);

		res.sendStatus(201);
	} catch (error) {
		res.sendStatus(500);
	}
}

export async function signinUser(req, res) {
	const data = req.body;

	try {
		const { rows: user } = await searchUser(data.email);

		if (!user.length) return res.status(401).send("Usuário/senha inválidos!");

		const token = generateToken(data.password, user);

		if (token === "error")
			return res.status(401).send("Usuário/senha inválidos!");

		res.status(200).send(token);
	} catch (error) {
		res.sendStatus(500);
	}
}
