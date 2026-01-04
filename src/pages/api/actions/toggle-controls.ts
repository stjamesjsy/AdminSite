import { pool } from "../../../database";

export default async function handler(req: any, res: any) {
    try {
        const screenId = req.body.screenId;
        const showControls = req.body.showControls;

        await pool.execute("UPDATE screens SET isControlsShown = ? WHERE id = ?", [
            showControls,
            screenId
        ]);

        return res.status(200).end();
    } catch (e: any) {
        return res.status(500).json({ error: e.message });
    }
}