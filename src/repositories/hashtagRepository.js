import connection from "../databases/postgres.js";

export async function createHashtag(name) {
	const { rows: exist } = await connection.query(
		`SELECT * FROM hashtags WHERE name = $1`,
		[name]
	);

	if (exist.length === 0) {
		await connection.query(`INSERT INTO hashtags (name) VALUES ($1)`, [name]);
	}
}

export async function PostByHashtag(hashtag, idPost) {
	const { rows: idHashtag } = await connection.query(
		`SELECT (id) FROM hashtags WHERE name = $1`,
		[hashtag]
	);

	if (idHashtag.length) {
		await connection.query(
			`INSERT INTO post_hashtag (post_id, hashtag_id) VALUES ($1, $2)`,
			[idPost, idHashtag[0].id]
		);
	}
}

export async function searchHashtag(hashtag) {
	return await connection.query(
		`
        SELECT * FROM hashtags 
        WHERE name = $1
    `,
		[hashtag]
	);
}

export async function getAllPostsFromHashtag(idFromCurrentUser, hashtag) {
	return await connection.query(
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
    JOIN post_hashtag ph
    ON posts.id = ph.post_id 
    JOIN hashtags
    ON ph.hashtag_id = hashtags.id
	WHERE hashtags.name = $2
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
		[idFromCurrentUser, hashtag]
	);
}

export async function getTags() {
	return await connection.query(`
        SELECT h.name, COUNT (p.id) as "postId"
        FROM post_hashtag ph
        JOIN posts p 
        ON p.id = ph.post_id
        JOIN hashtags h
        ON h.id = ph.hashtag_id
        GROUP BY h.name
        ORDER BY "postId" DESC
        LIMIT 10
    `);
}

export async function deleteFromHashtagQuery(idPost) {
	return await connection.query(
		`
    DELETE FROM post_hashtag
    WHERE post_id = $1
  `,
		[idPost]
	);
}
