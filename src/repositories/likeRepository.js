import connection from "../databases/postgres.js";

export async function handleLike (userId, postId, likeStatus) {

    const { rowCount } = await connection.query(`
        SELECT * FROM likes
        WHERE "userId" = $1 AND "postId" = $2
    `, [userId, postId]);
    
    if (rowCount) {

        await connection.query(`
            UPDATE likes 
            SET liked = $1 
            WHERE "userId" = $2 AND "postId" = $3;
        `, [likeStatus, userId, postId ]);
    } else {

        await connection.query(`
            INSERT INTO likes (
                "userId", "postId", liked
            )
            VALUES ($1, $2, $3)
        `, [userId, postId, true]);
    }
}

export async function getLikes (id) {

    const { rows: likes } = await connection.query(`
        SELECT posts.id, (CASE WHEN users.id = $1 THEN 'You' ELSE users.username END)
        FROM posts
        JOIN likes
        ON posts.id = likes."postId"
        LEFT JOIN users
        ON users.id = likes."userId"
        ORDER BY posts."createdAt" DESC
        LIMIT 20
    `, [id]);

    return likes;
}