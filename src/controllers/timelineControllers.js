import { createPost } from "../repositories/timelineRepository.js";

export async function publishPost (req, res) {

    const { url, text } = req.body;

    try {

        await createPost(url, text);

        res.sendStatus(201);

    } catch (error) {
        res.sendStatus(500);
    }    
}