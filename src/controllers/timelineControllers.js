import dbRequest from "../repositories/index.js";

export async function publishPost (req, res) {

    const { url, text } = req.body;

    try {

        await dbRequest.createPost(url, text);

        res.sendStatus(201);

    } catch (error) {
        res.sendStatus(500);
    }    
}