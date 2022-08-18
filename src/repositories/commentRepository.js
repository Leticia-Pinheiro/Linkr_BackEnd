import connection from "../databases/postgres.js";

export async function countCommentsQuery(id) {
	return await connection.query(
		`
        SELECT COUNT(comments) AS "totalComments" FROM comments WHERE comments."postId" = $1
    `,
		[id]
	);
}

export async function getComments(idPost, user) {
	return await connection.query(
		`
        SELECT comments.*, users.username, users."imageUrl", (select follow.following from follow where follow."followingUserId" = comments."userId" and follow."userId" = $2) FROM comments
        JOIN users
        ON users.id = comments."userId"
        WHERE comments."postId" = $1
        ORDER BY comments."createdAt" ASC
    `,
		[idPost, user]
	);
}

export async function postCommentQuery(text, authorId, postId) {
	await connection.query(
		`
    INSERT INTO comments (text, "userId", "postId") VALUES ($1, $2, $3)
    `,
		[text, authorId, postId]
	);
}
