import connection from "../databases/postgres.js";

export async function repostQuery(name, userId, postId) {
	await connection.query(
		`
        INSERT INTO repost ("repostFrom", "userId", "postId") values ($1, $2, $3)
    `,
		[name, userId, postId]
	);
}

export async function countRepostQuery(id) {
	return connection.query(
		`
    SELECT COUNT(repost."postId") AS total FROM repost WHERE repost."postId" = $1
    `,
		[id]
	);
}
