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

export async function searchUserById(idUser, idPost) {
	return connection.query(
		`
	SELECT * FROM users
	JOIN posts
	ON users.id = posts."userId"
	WHERE users.id = $1 AND posts.id = $2
	`,
		[idUser, idPost]
	);
}
