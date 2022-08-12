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
        SELECT posts.*, users.id, users.username, users."imageUrl" FROM posts
        JOIN users
        ON posts."userId" = users.id 
        ORDER BY posts."createdAt" DESC
        LIMIT 20
    `);
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