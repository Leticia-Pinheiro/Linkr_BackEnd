import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export function generateToken(password, user) {
	if (user.length && bcrypt.compareSync(password, user[0].password)) {
		const token = jwt.sign(
			{
				id: user[0].id,
			},
			process.env.SECRET_KEY_TOKEN
		);

		return token;
	} else {
		return "error";
	}
}