import { EmailService } from "./EmailService"
import { JiraService } from "./JiraService"

class ReporterService {

    validateSDKKey(apikey: string): Promise<any> {
        return new Promise((resolve, reject) => {

            var sdkKey = process.env.apiKey
            if (apikey == sdkKey) {
                resolve(true)
            }
            else {
                resolve(false)
            }

        })
    }


    createNewTicketWithAttachments(description: string, attachments: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const jiraService = new JiraService()
            jiraService.createTicket(description).then(createResult => {
                var response = `Ticket created with id: ${createResult.id} and key: ${createResult.key}`
                this.uploadAttachments(createResult, attachments).then(result => {
                    console.log(result)
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            }).catch(createErr => reject(createErr))
        })
    }

    uploadAttachments(createResult: any, attachments: Array<any>): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log(`uploading attachments ${attachments.length}`)
            // upload attachment
            const jiraService = new JiraService()
            let promises: Promise<any>[] = new Array(2);
            for (let index = 0; index < attachments.length; index++) {
                promises[index] = new Promise((resolve, reject) => {
                    jiraService.attachmentToTicket(createResult.key, attachments[index]).then(result => resolve(result)).catch(err => reject(err))
                })
            }
            Promise.all(promises).then((result: Array<any>) => {
                //resolve('UPLOADED')
                // sendConfirmationEmail
                new EmailService().sendConfirmationEmail("ankitagarwal5859@gmail.com", "Ankit", "Test", "Test").then(emailResult => {
                    resolve(emailResult)
                }).catch(err => {
                    reject(err)
                })
            }).catch(err => {
                reject(err)
            })
        })
    }
}

export { ReporterService }