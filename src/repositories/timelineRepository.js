import connection from "../databases/postgres.js";

export async function createPost (url, text) {

        await connection.query(`
            INSERT INTO posts (url, text)
            VALUES ($1, $2)
        `, [url, text]);
        
}
