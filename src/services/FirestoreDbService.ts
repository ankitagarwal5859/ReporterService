import { Firestore, WriteResult } from '@google-cloud/firestore'

class FirestoreDbService {
    private db;
    private static instance: any;

    private constructor() {
        var projectId = process.env.projectId
        this.db = new Firestore({projectId: projectId})
        this.db.settings({ ignoreUndefinedProperties: true })
    }
    
    static getInstance() {
        if (!FirestoreDbService.instance) {
            FirestoreDbService.instance = new FirestoreDbService();
        }
        return FirestoreDbService.instance;
    }

    getDBInstance() {
        return this.db;
    }

    createDocument(collection: string, docId: string, data: any) : Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).doc(docId).create(data).then((result: WriteResult) => {
                resolve(result);
            }).catch((err: Error) => {
                reject(err);
            });
        });
    }
    
}

export { FirestoreDbService }