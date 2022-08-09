import connection from "../database/postgres.js";

const timelineRepositories = {

    createPost: async function (url, text) {

        await connection.query(`
            INSERT INTO posts (url, text)
            VALUES ($1, $2)
        `, [url, text]);
        
    }
};

export default timelineRepositories;