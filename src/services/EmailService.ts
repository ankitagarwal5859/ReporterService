import Handlebars from "handlebars";
import { createTransport, SentMessageInfo, Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { read } from "../utils/FileIO";

class EmailService {

    private email = process.env.email

    sendConfirmationEmail(toEmail: string, toName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const path: string  = 'src/utils/html/EmailTemplate.html';
            read(path).then((html: string) => {
                var template = Handlebars.compile(html);
                var replacements = {
                    displayName: toName
                };
                var htmlToSend = template(replacements);
                var mailOptions = {
                    from: this.email,
                    to: toEmail,
                    subject: `Medidata feedback registred`,
                    html: htmlToSend,
                };
                this.sendEmail(mailOptions).then((result: string) => {
                    resolve(result)
                }).catch((err: Error) => {
                    reject(err)
                })
            }).catch((err: Error) => {
                console.log(`Failed to send email to ${toEmail}. ${err.message}`, err.stack)
                reject(err)
            })
        })
    }

    sendEmail(mailOptions: Mail.Options): Promise<any> {
        return new Promise((resolve, reject) => {
            // Should use email with app password to send email
            // https://support.google.com/mail/answer/185833?hl=en&authuser=1
            var transporter: Transporter = createTransport({
                service: 'gmail',
                secure: true,
                auth: {
                  user: this.email,
                  pass: process.env.emailAppPassword
                }
            });
            transporter.sendMail(mailOptions).then((result: SentMessageInfo) => {
                //console.log(result)
                resolve(`Email sent to ${mailOptions.to}`)
            }).catch((err: Error) => {
                console.log(`Failed to send email to ${mailOptions.to}. ${err.message}`, err.stack)
                reject(err)
            })
        })
    }
}

export { EmailService }