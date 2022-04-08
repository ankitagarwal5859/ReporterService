import { EmailService } from "./EmailService"
import { GcsService } from "./GcsService"
import { JiraService } from "./JiraService"
import { FirestoreDbService } from "./FirestoreDbService"
import { IssueDetails } from "../models/IssueDetails"

class ReporterService {

    createNewTicketWithAttachments(userId: string, description: string, attachments: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const jiraService = new JiraService()
            jiraService.createTicket(description).then(createResult => {
                var response = `Ticket created with id: ${createResult.id} and key: ${createResult.key}`
                this.uploadAttachments(createResult, attachments, description).then(result => {
                    console.log(result)
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            }).catch(createErr => reject(createErr))
        })
    }

    uploadAttachments(createResult: any, attachments: Array<any>, description: string): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log(`uploading attachments ${attachments.length}`)
            // upload attachment
            const jiraService = new JiraService()
            var n = attachments.length
            let promises: Promise<any>[] = new Array(n*2 + 1);
            for (let index = 0; index<n; index++) {
                promises[index] = new Promise((resolve, reject) => {
                    jiraService.attachmentToTicket(createResult.key, attachments[index]).then(result => resolve(result)).catch(err => reject(err))
                })
            }
            const gcsService = new GcsService()
            for (let index = n; index<(n*2); index++) {
                promises[index] = new Promise((resolve, reject) => {
                    gcsService.sendUploadToGCS(createResult.id, attachments[index-n]).then(result => resolve(result)).catch(err => reject(err))
                })
            }
            const dbService = FirestoreDbService.getInstance()
            var filePath: Array<string> = []
            for (let index = 0; index<n; index++) {
                filePath[index] = attachments[index].name
            }
            var issue: IssueDetails = {
                id: createResult.id,
                key: createResult.key,
                description: description,
                filePath: filePath
            }
            promises[n*2 + 1] = new Promise((resolve, reject) => {
                dbService.createDocument('issues', createResult.id, issue).then((result: any) => {
                    console.log('Saved in DB')
                    resolve(result)
                }).catch((err: Error) => reject(err))
            })
            
            Promise.all(promises).then((result: Array<any>) => {
                // sendConfirmationEmail
                new EmailService().sendConfirmationEmail("ankitagarwal5859@gmail.com", "Ankit").then(emailResult => {
                    resolve (emailResult)
                }).catch(err => {
                    reject(err)
                })
            }).catch(err => {
                reject(err)
            })
        })
    }
}

export {ReporterService}