import connection from "../databases/postgres.js";

export async function createPost(userId, url, text, title, image, description) {
	return await connection.query(
		`
            INSERT INTO posts ("userId", url, text, "urlTitle", "urlImage", "urlDescription")
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
            
        `,
		[userId, url, text, title, image, description]
	);
}

export async function getAllPosts(userId) {
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
    JOIN follow
	ON follow."userId" <> users.id AND follow.following = (SELECT follow.following FROM follow WHERE follow."userId" = $1 and posts."userId" = follow."followingUserId")
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
		[userId]
	);
}

export async function getAllPostsFromUser(idFromCurrentUser, idFromUserPost) {
	return connection.query(
		`
    SELECT 
      posts.*, 
      COALESCE((SELECT follow.following from follow WHERE follow."userId" = $1 AND follow."followingUserId" = $2), false) AS following,
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
	WHERE users.id = $2
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
		[idFromCurrentUser, idFromUserPost]
	);
}

export async function deleteFromLikesQuery(id) {
	return connection.query(
		`
    DELETE FROM likes WHERE likes."postId" = $1;
    
    `,
		[id]
	);
}

export async function deleteFromPostsQuery(id) {
	return connection.query(
		`
    
    DELETE FROM posts WHERE posts.id = $1
    `,
		[id]
	);
}

export async function updateText(id, newText) {
	await connection.query(
		`
    UPDATE posts 
    SET text = $2
    WHERE posts.id = $1
  `,
		[id, newText]
	);
}

export async function recentPosts (userId, lastPostCreatedAt) {

  const post = await connection.query(`
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
    WHERE posts."createdAt" > $2
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
    [userId, lastPostCreatedAt]
  );

  return post;
}
