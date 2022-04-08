const axios = require('axios').default;
import FormData from 'form-data';
import { IssueDetails } from '../models/IssueDetails';

class JiraService {

    createTicket(issueDetails:IssueDetails): Promise<any> {
        return new Promise((resolve, reject) => {
            var description =issueDetails.locale +" \n" + issueDetails.description

            var body = `{"fields":{"project":{"key":"SRB"},"summary":"${issueDetails.title}","parent":{"key":"SRB-2"},"description":"${description}","issuetype":{"self":"https://medidataandroid.atlassian.net/rest/api/3/issuetype/100012","id":"10001","description":"${description}","iconUrl":"https://medidataandroid.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=medium","name":"Task","subtask":false,"avatarId":10318,"entityId":"dacb7f2d-6a83-4e2a-868c-a635d6ea7bfa","hierarchyLevel":0}}}`
            const url = process.env.baseUrl + "rest/api/2/issue"
            
            var headers = {
                'Content-Type': 'application/json',
                'Authorization': process.env.jiraBasicAuth
            }
            axios.post(url, body, { headers: headers}).then((response: any) => {
                console.log(response.data)
                resolve(response.data);
            }).catch((error: Error) => {
                console.log(error)
                reject(error);
            });
        })
    }

    attachmentToTicket(key: string, file: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            form.append('file', file.data, file.name);
            const url = process.env.baseUrl + `rest/api/2/issue/${key}/attachments`
            var headers = {
                ...form.getHeaders(),
                'X-Atlassian-Token': 'nocheck',
                'Authorization': process.env.jiraBasicAuth
            }
            axios.post(url, form, { headers: headers}).then((response: any) => {
                console.log(`File uploaded to Jira: ${file.name}`)
                resolve(response.data);
            }).catch((error: Error) => {
                console.log(error)
                reject(error);
            });
        })
    }
}

export {JiraService}