import { Storage } from "@google-cloud/storage";
import { v4 as uuid } from "uuid";
// @ts-ignore
import nodeFetch from "node-fetch";
import { Readable } from 'node:stream';

class GoogleCloud {
    private storage: Storage;

    constructor() {
        this.storage = new Storage({
            keyFilename: "./googleCloud.json"
        });
    }

    /**
     * Upload a file to the CDN on the server.
     * 
     * @param fileName The name of the file
     * @param filePathOrUrl The path of the file or a url
     */
    public async uploadFile(fileName: string, filePathOrUrl: string) {
        const randomId = uuid();
        const fullPath = `${randomId}/${fileName.replace(/ /g, "_")}`;

        return this._uploadFileServer(fullPath, filePathOrUrl);
    }

    private async _uploadFileServer(fileName: string, filePathOrUrl: string): Promise<any> {
        try {
            const bucket = await this.storage.bucket("cdn.basket.je");

            if (!filePathOrUrl.startsWith("http://") && !filePathOrUrl.startsWith("https://")) {
                return await bucket.upload(filePathOrUrl, {
                    destination: fileName
                });
            }

            const file = bucket.file(fileName);
            const writeStream = file.createWriteStream();

            return nodeFetch(filePathOrUrl)
                .then((res: any) => res.body.pipe(writeStream));
        } catch (e: any) {
            console.error("GCP Error: " + e.message, e);
            throw e;
        }
    }
}

const googleCloud = new GoogleCloud();
export default googleCloud;