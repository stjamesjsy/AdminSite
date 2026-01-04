import os from "os";

export default async function handler(req: any, res: any) {
    try {
        const uptimeSeconds = os.uptime();

        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = Math.floor(uptimeSeconds % 60);

        return res.status(200).json({
            uptime: `${hours}h ${minutes}m ${seconds}s`
        });
    } catch (e: any) {
        return res.status(500).json({ error: e.message });
    }
}
