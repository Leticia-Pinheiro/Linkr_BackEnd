import connection from "../databases/postgres.js";

export async function createPost(url, text, title, image, description) {
	await connection.query(
		`
            INSERT INTO posts (url, text, "urlTitle", "urlImage", "urlDescription")
            VALUES ($1, $2, $3, $4, $5)
        `,
		[url, text, title, image, description]
	);
}

export async function getAllPosts() {
	return connection.query(`
        SELECT posts.*, users.id, users.username, users."imageUrl" FROM posts
        JOIN users
        ON posts."userId" = users.id 
        ORDER BY posts."createdAt" DESC
        LIMIT 20
    `);
}
