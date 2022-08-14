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

//   await connection.query(
//     `INSERT INTO teste (name, text) VALUES ($1, $2)`, [name, text]
// )
}