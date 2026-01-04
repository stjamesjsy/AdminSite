import { NextApiRequest, NextApiResponse } from "next";
import { withFileUpload } from "next-multiparty";
import googleCloudServer from "../../utils/googleCloudServer";
import { CDN_URL } from "../../utils/constants";

type CustomApiRequest = NextApiRequest & {
    fields: any;
    files: any;
    file: any;
}

export default withFileUpload(async function handler(req: CustomApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== "POST") {
            return res.status(400).json({ error: "Invalid request" });
        }
        try {
            const fileName = req.fields.fileName;
            const filePath = req.fields.image ? req.fields.filePath : req.file.filepath;
            const uploadResult = await googleCloudServer.uploadFile(fileName, filePath);

            console.log("File uploaded: " + uploadResult[0].name);

            return res.json({
                url: `${CDN_URL}/${uploadResult[0].name}`
            })
        } catch (e: any) {
            throw e;
        }
    } catch (e: any) {
        return res.status(500).json({ error: e.message });
    }
});

export const config = {
    api: {
        bodyParser: false
    }
};