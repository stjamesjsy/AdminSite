import { pool } from "../../../database";

export default async function handler(req: any, res: any) {
    try {
        const screenId = req.body.screenId;
        const activeVideoId = req.body.activeVideoId;

        await pool.execute("UPDATE screens SET activeVideoId = ? WHERE id = ?", [
            activeVideoId,
            screenId
        ]);

        return res.status(200).end();
    } catch (e: any) {
        return res.status(500).json({ error: e.message });
    }
}