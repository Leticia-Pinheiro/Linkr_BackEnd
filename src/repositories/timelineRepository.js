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

export async function getAllPosts(id) {
	return connection.query(
		`
    SELECT 
      posts.*, 
      COALESCE((select likes.liked from likes where likes."userId" = $1 and likes."postId" = posts.id), false) As liked,
      (SELECT COUNT(*) FROM likes WHERE likes."postId" = posts.id AND likes.liked = true) AS likes,
      (SELECT
        ARRAY_AGG((CASE WHEN likes."userId" = $1 THEN 'You' ELSE u.username END)
        ORDER BY CASE WHEN likes."userId" = $1 THEN 1 ELSE 2 END) AS "whoLiked"
      FROM likes
      JOIN users as u
      ON likes."userId" = u.id
      WHERE likes."postId" = posts.id AND likes.liked = true
      GROUP BY posts.id),
      users.username,
      users.email,
      users."imageUrl"
    FROM posts
    JOIN users
    ON posts."userId" = users.id 
    GROUP BY 
      posts.id, 
      posts."createdAt",
      posts."userId",
      posts.url,
      posts.text,
      posts."urlTitle",
      posts."urlImage",
      posts."urlDescription",
      users.username,
      users.email,
      users."imageUrl"
    ORDER BY posts."createdAt" DESC
    LIMIT 20
    `,
		[id]
	);
}

export async function getAllPostsFromUser(idFromCurrentUser, idFromUserPost) {
	return connection.query(
		`
    SELECT COALESCE((select likes.liked from likes where likes."userId" = $1 and likes."postId" = posts.id), false) As liked, posts.*, users.email, users.username, users."imageUrl" FROM posts
    JOIN users
    ON posts."userId" = users.id 
    WHERE users.id = $2
    ORDER BY posts."createdAt" DESC
    LIMIT 20
`,
		[idFromCurrentUser, idFromUserPost]
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
