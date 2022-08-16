import connection from "../databases/postgres.js";

export async function createFollow(userId, followingUserId) {
	await connection.query(
		`
        INSERT INTO follow ("userId", "followingUserId", following) VALUES ($1, $2, true)
    `,
		[userId, followingUserId]
	);
}

export async function isFollowing(userId, followingUserId) {
	return await connection.query(
		`

        SELECT * FROM follow 
        WHERE "userId" = $1 AND "followingUserId" = $2
    `,
		[userId, followingUserId]
	);
}

export async function unfollow(userId, followingUserId) {
	await connection.query(
		`
        DELETE FROM follow
        WHERE "userId" = $1 AND "followingUserId" = $2
    `,
		[userId, followingUserId]
	);
}
