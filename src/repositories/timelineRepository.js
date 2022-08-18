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

export async function getAllPosts(userId, page) {
	return connection.query(
		`
      (SELECT 
      repost."repostFrom",
      repost."userId" AS "repostFromId",
      repost."postId" AS "repostId",
        posts.*, 
        COALESCE((SELECT likes.liked FROM likes WHERE likes."userId" = $1 AND likes."postId" = posts.id), false) AS liked,
        (SELECT COUNT(*) FROM likes WHERE likes."postId" = posts.id AND likes.liked = true) AS likes,
        (SELECT
          ARRAY_AGG((CASE WHEN likes."userId" = $1 THEN 'You' ELSE u.username END)
          ORDER BY CASE WHEN likes."userId" = $1 THEN 1 ELSE 2 END) AS "whoLiked"
        FROM likes
        JOIN users AS u
        ON likes."userId" = u.id
        WHERE likes."postId" = posts.id AND likes.liked = true
        GROUP BY posts.id),
        users.username,
        users.email,
        users."imageUrl"
      FROM repost
      JOIN posts
      ON posts.id = repost."postId"
      JOIN users 
      ON users.id = posts."userId"
      JOIN follow
      ON repost."userId" = $1 or follow."followingUserId" = repost."userId" and follow."userId" = $1
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
        users."imageUrl",
      repost."repostFrom",
      repost."userId",
      repost."postId",
      repost."createdAt" 
      order by repost."createdAt" DESC)
  
      UNION
    
      (SELECT 
      NULL,
      NULL,
      NULL,
      posts.*, 
        COALESCE((SELECT likes.liked FROM likes WHERE likes."userId" = $1 AND likes."postId" = posts.id), false) AS liked,
        (SELECT COUNT(*) FROM likes WHERE likes."postId" = posts.id AND likes.liked = true) AS likes,
        (SELECT
          ARRAY_AGG((CASE WHEN likes."userId" = $1 THEN 'You' ELSE u.username END)
          ORDER BY CASE WHEN likes."userId" = $1 THEN 1 ELSE 2 END) AS "whoLiked"
        FROM likes
        JOIN users AS u
        ON likes."userId" = u.id
        WHERE likes."postId" = posts.id AND likes.liked = true
        GROUP BY posts.id),
        users.username,
        users.email,
        users."imageUrl"
      FROM follow
      JOIN posts
      ON posts."userId" = follow."followingUserId" 
      JOIN users
      ON users.id = follow."followingUserId"
      WHERE follow."userId" = $1
      ORDER BY "createdAt" DESC)
      ORDER BY "createdAt" DESC
      LIMIT 10 * $2
    `,
		[userId, page]
	);
}

export async function getAllPostsFromUser(
	idFromCurrentUser,
	idFromUserPost,
	page
) {
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
    LIMIT 10 * $3
`,
		[idFromCurrentUser, idFromUserPost, page]
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

export async function recentPosts(userId, lastPostCreatedAt) {
	const post = await connection.query(
		`
    (SELECT 
      repost."repostFrom",
      repost."userId" AS "repostFromId",
      repost."postId" AS "repostId",
        posts.*, 
        COALESCE((SELECT likes.liked FROM likes WHERE likes."userId" = $1 AND likes."postId" = posts.id), false) AS liked,
        (SELECT COUNT(*) FROM likes WHERE likes."postId" = posts.id AND likes.liked = true) AS likes,
        (SELECT
          ARRAY_AGG((CASE WHEN likes."userId" = $1 THEN 'You' ELSE u.username END)
          ORDER BY CASE WHEN likes."userId" = $1 THEN 1 ELSE 2 END) AS "whoLiked"
        FROM likes
        JOIN users AS u
        ON likes."userId" = u.id
        WHERE likes."postId" = posts.id AND likes.liked = true
        GROUP BY posts.id),
        users.username,
        users.email,
        users."imageUrl"
      FROM repost
      JOIN posts
      ON posts.id = repost."postId"
      JOIN users 
      ON users.id = posts."userId"
      JOIN follow
      ON repost."userId" = $1 or follow."followingUserId" = repost."userId" and follow."userId" = $1
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
        users."imageUrl",
      repost."repostFrom",
      repost."userId",
      repost."postId",
      repost."createdAt" 
      order by repost."createdAt" DESC)
  
      UNION
    
      (SELECT 
      NULL,
      NULL,
      NULL,
      posts.*, 
        COALESCE((SELECT likes.liked FROM likes WHERE likes."userId" = $1 AND likes."postId" = posts.id), false) AS liked,
        (SELECT COUNT(*) FROM likes WHERE likes."postId" = posts.id AND likes.liked = true) AS likes,
        (SELECT
          ARRAY_AGG((CASE WHEN likes."userId" = $1 THEN 'You' ELSE u.username END)
          ORDER BY CASE WHEN likes."userId" = $1 THEN 1 ELSE 2 END) AS "whoLiked"
        FROM likes
        JOIN users AS u
        ON likes."userId" = u.id
        WHERE likes."postId" = posts.id AND likes.liked = true
        GROUP BY posts.id),
        users.username,
        users.email,
        users."imageUrl"
      FROM follow
      JOIN posts
      ON posts."userId" = follow."followingUserId" 
      JOIN users
      ON users.id = follow."followingUserId"
      WHERE follow."userId" = $1 AND posts."createdAt" > $2
      ORDER BY "createdAt" DESC)
      ORDER BY "createdAt" DESC
    `,
		[userId, lastPostCreatedAt.replace('T', ' ').replace('Z', '')]
	);

	return post;
}
