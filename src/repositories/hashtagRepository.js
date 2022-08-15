import { getHashtags } from "../controllers/timelineControllers.js";
import connection from "../databases/postgres.js";

export async function createHashtag(name){
    const { rows : exist } = await connection.query(`SELECT * FROM hashtags WHERE name = $1`, [name])
   
    if(exist.length === 0){
        await connection.query(
            `INSERT INTO hashtags (name) VALUES ($1)`, [name]
        )
    }   
    
}

export async function PostByHashtag(hashtag, token, url, text){
    // const {rows : idPost} = await connection.query(`SELECT (id) FROM posts WHERE "userId" = $1 AND text = $2 AND url = $3`, [token, text, url])
    // const {rows : idHashtag} = await connection.query(`SELECT (id) FROM hashtags WHERE name = $1`, [hashtag])

    await connection.query(
      `INSERT INTO post_hashtag (hashtag, "userId", text, url) VALUES ($1, $2, $3, $4)`, [hashtag, token, text, url]
  )
}

export async function searchHashtag(hashtag) {
	return connection.query(
		`
        SELECT * FROM hashtags 
        WHERE name = $1
    `,
		[hashtag]
	);
}

export async function getAllPostsFromHashtag(idFromCurrentUser, hashtag) {
	return connection.query(
		`
        SELECT COALESCE((select likes.liked from likes where likes."userId" = $1 and likes."postId" = posts.id), false) As liked, posts.*, users.email, users.username, users."imageUrl" FROM posts
        JOIN users
        ON posts."userId" = users.id
        JOIN post_hashtag ph
        ON posts."userId" = ph."userId" AND posts.url = ph.url AND posts.text = ph.text
        JOIN hashtags
        ON ph.hashtag = hashtags.name
        WHERE hashtags.name = $2
        ORDER BY posts."createdAt" DESC
        LIMIT 20
`,
		[idFromCurrentUser, hashtag]
	);
}

export async function getTags(){
    return connection.query (`
    SELECT hashtags.id, hashtags.name FROM hashtags
    JOIN post_hashtag ph
    ON ph.hashtag = hashtags.name
    JOIN posts 
    ON posts."userId" = ph."userId" AND posts.url = ph.url AND posts.text = ph.text
    WHERE posts.id IS NOT NULL
    LIMIT 10`);
}