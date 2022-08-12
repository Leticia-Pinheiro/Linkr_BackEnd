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

export async function searchUserById(id) {
	return connection.query(
		`
        SELECT * FROM users 
        WHERE users.id = $1
    `,
		[id]
	);
}

export async function isPostFromUser(idUser, idPost) {
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

export async function searchUsers(str) {
	return connection.query(
		`
		SELECT users.username, users."imageUrl", users.id 
		FROM users 
		WHERE to_tsvector(username) @@ to_tsquery($1 || ':*') 
	`,
		[str]
	);
}
