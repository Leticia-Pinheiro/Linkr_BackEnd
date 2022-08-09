import connection from "../databases/postgres.js";
import bcrypt from "bcrypt";

export async function singup(data) {
	const HASH = 10;
	const encryptedPassaword = bcrypt.hashSync(data.password, HASH);

	return connection.query(
		`INSERT INTO users (username, email, password, "imageUrl") VALUES ($1, $2, $3, $4)`,
		[data.username, data.email, encryptedPassaword, data.url]
	);
}
