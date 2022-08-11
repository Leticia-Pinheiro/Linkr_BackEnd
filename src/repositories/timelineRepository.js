import connection from "../databases/postgres.js";

export async function createPost(userId, url, text, title, image, description) {
	await connection.query(
		`
            INSERT INTO posts ("userId", url, text, "urlTitle", "urlImage", "urlDescription")
            VALUES ($1, $2, $3, $4, $5, $6)
        `,
		[userId, url, text, title, image, description]
	);
}

export async function getAllPosts() {
	return connection.query(`

        SELECT posts.*, users.email, users.username, users."imageUrl" FROM posts
        JOIN users
        ON posts."userId" = users.id 
        ORDER BY posts."createdAt" DESC
        LIMIT 20
    `);
}

export async function getAllPostsFromUser(id) {
	return connection.query(
		`
    SELECT posts.*, users.email, users.username, users."imageUrl" FROM posts
    JOIN users
    ON posts."userId" = users.id 
    WHERE users.id = $1
    ORDER BY posts."createdAt" DESC
    LIMIT 20
`,
		[id]
	);
}

export async function deleteQuery(id) {
	return connection.query(
		`
        DELETE FROM posts
        WHERE posts.id = $1
    `,
		[id]
	);
}
