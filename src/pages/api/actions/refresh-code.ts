import { getServerSession } from "next-auth";
import { pool } from "../../../database";
import { authOptions } from "../auth/[...nextauth]";
import { generateRandomChars } from "../../../utils/clientUtils";

export default async function handler(req: any, res: any) {
    try {
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
            return res.status(401).end();
        }
        
        const screenId = req.body.screenId;
        const code = generateRandomChars(4);

        await pool.execute("UPDATE screens SET uniqueCode = ? WHERE id = ?", [
            code,
            screenId
        ]);

        return res.status(200).end();
    } catch (e: any) {
        return res.status(500).json({ error: e.message });
    }
}