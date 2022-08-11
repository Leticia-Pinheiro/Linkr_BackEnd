import { handleLike } from "../repositories/likeRepository.js";

export async function updateLike (req, res) {

    const { postId, postStatus } = req.body;
	const { tokenDecoded } = res.locals;
    const userId = tokenDecoded.id

    try {
        
        await handleLike(userId, postId, postStatus);

        res.status(200).send('updated');

    } catch (error) {
        res.sendStatus(500);
    }
}