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