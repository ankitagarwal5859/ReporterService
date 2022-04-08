export interface IssueDetails {
    id: string,
    key: string,
    description: string,
    filePath: Array<string>,
    title:string,
    email: string,
    locale: string,
    date: string,
    brand: string,
    model: string,
    SDKVersion: string,
    release: string,
    buildType: string
}