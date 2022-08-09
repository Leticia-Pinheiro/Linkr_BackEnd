import connection from "../databases/postgres.js";

export async function searchUser(email) {
	return connection.query(
		`
        SELECT * FROM users 
        WHERE users.email = $1
    `,
		[email]
	);
}
