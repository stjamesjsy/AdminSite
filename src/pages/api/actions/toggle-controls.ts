import { getServerSession } from "next-auth";
import { pool } from "../../../database";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: any, res: any) {
    try {
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
            return res.status(401).end();
        }
        
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