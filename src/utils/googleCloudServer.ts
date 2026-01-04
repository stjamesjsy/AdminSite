import { Storage } from "@google-cloud/storage";
import { v4 as uuid } from "uuid";
import fetch from "node-fetch";
import { pipeline } from "node:stream/promises";
import { GCP_BUCKET_NAME } from "./constants";

const storage = new Storage({
    keyFilename: "./googleCloud.json"
});

/**
 * Upload a file to Google Cloud Storage.
 */
export async function uploadFileServer(
    originalFileName: string,
    filePathOrUrl: string
) {
    const id = uuid();
    const safeName = originalFileName.replace(/\s+/g, "_");
    const destination = `${id}/${safeName}`;

    const bucket = storage.bucket(GCP_BUCKET_NAME);

    try {
        if (!filePathOrUrl.startsWith("http://") && !filePathOrUrl.startsWith("https://")) {
            await bucket.upload(filePathOrUrl, {
                destination
            });
            return destination;
        }

        const response = await fetch(filePathOrUrl);

        if (!response.ok || !response.body) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
        }

        const file = bucket.file(destination);

        await pipeline(
            response.body,
            file.createWriteStream()
        );

        return destination;
    } catch (error) {
        console.error("GCP upload error:", error);
        throw error;
    }
}