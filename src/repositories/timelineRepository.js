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
        COALESCE((select likes.liked from likes where likes."userId" = $1 and likes."postId" = posts.id), false) As liked,
        posts.*, 
        users.username,
        users.email,
        users."imageUrl"
    FROM posts
    JOIN users
    ON posts."userId" = users.id 
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

export async function createHashtag(name){
    const { rows : exist } = await connection.query(`SELECT * FROM hashtags WHERE name = $1`, [name])
   
    if(exist.length === 0){
        await connection.query(
            `INSERT INTO hashtags (name) 
            VALUES ($1)`,
            [name]
        )
    }   
    
}