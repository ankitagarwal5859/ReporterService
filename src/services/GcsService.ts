import { Storage } from "@google-cloud/storage";

class GcsService {

    sendUploadToGCS(issueId: string, fileToUpload: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const bucketName = process.env.bucketName
            if (bucketName) {
                const gcsFileName = issueId + '/' + fileToUpload.name;
                const storage = new Storage();
                const file = storage.bucket(bucketName).file(gcsFileName);
            
                const stream = file.createWriteStream({
                    metadata: {
                        contentType: fileToUpload.mimetype,
                    },
                    resumable: false,
                });
            
                stream.on('error', (err) => {
                    console.log(err)
                    reject(err);
                });
            
                stream.on('finish', async () => {
                    console.log(`File uploaded to bucket: ${gcsFileName}`)
                    resolve(gcsFileName)
                });
            
                stream.end(fileToUpload.data);
            } else {
                reject('GCS bucket name not found')
            }
        })
    }
}

export { GcsService }