import { readFile } from 'fs';

export const read = function (path: string): Promise<any> {
    return new Promise((resolve, reject) => {
        readFile(path, { encoding: 'utf-8' }, function (err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        });
    })
}