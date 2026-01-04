interface FileUploadProps {
    onBeginUpload: () => void;
    onFailedUpload: () => void;
    onFinishUpload: (url: string) => void;
}

class GoogleCloud {
    
    /**
     * Upload a file to the CDN.
     *
     * @param fileName The name of the file
     * @param filePathOrUrl The path of the file or a url
     */
    public async uploadFile(fileName: string, filePathOrUrl: string) {
        const formData = new FormData();

        formData.append("fileName", fileName);
        formData.append("filePath", filePathOrUrl);

        const result = await fetch("/api/upload", {
            method: "POST",
            body: formData
        });
        return result;
    }

    /**
     * Handles file uploading from the {@link FileUploadButton}.
     *
     * @param e The element event
     * @param props Callback handlers
     */
    public async handleFileUpload(e: any, props: FileUploadProps) {
        if (!e.target.files || e.target.files.length === 0) {
            throw new Error("File not selected");
        }
        const file = e.target.files[0];

        props.onBeginUpload();

        try {
            const result = await googleCloud.uploadFile(file.name, file);
            const json = await result.json();

            props.onFinishUpload(json.url);
        } catch (e: any) {
            props.onFailedUpload();
            throw e;
        }
    }
}

const googleCloud = new GoogleCloud();
export default googleCloud;