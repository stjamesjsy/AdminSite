import database from "../../database";

export default async function handler(req: any, res: any) {
    try {
        const generalData = req.body.general as any;
        const videoData = req.body.videos as any;
        const screenId = req.body.screenId;

        await database.execute("UPDATE screens SET isControlsShown = ?, isTimeShown = ?, activeVideoId = ? WHERE id = ?", [
            videoData.isControlsShown,
            videoData.isTimeShown,
            videoData.activeVideoId,
            screenId
        ]);

        return res.status(200).end();
    } catch (e: any) {
        return res.status(500).json({ error: e.message });
    }
}