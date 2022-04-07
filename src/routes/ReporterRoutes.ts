import express, { Response, NextFunction } from 'express';
import { basicAuth } from '../middleware/AuthService';
import { ReporterService } from '../services/ReporterService';

const router = express.Router();
const reporterService: ReporterService = new ReporterService();

router.post('/createTicket', basicAuth, (req: any, res: Response, next: NextFunction) => {
    if (!req.files) {
        res.status(400).send('No file uploaded');
    } else {
        const description = req.body.description
        console.log('ANkit'+req.files)
        reporterService.createNewTicketWithAttachments(description, req.files).then(result => {
            res.status(200).send(result);
        }).catch(err => {
            res.status(500).send(`Ticket not created`);
        })
    }
});


router.post('/validateSDKKey', basicAuth, (req: any, res: Response, next: NextFunction) => {
    if (!req.body.apikey) {
        res.status(400).send('No api key found');
    } else {
        const key = req.body.apikey
        reporterService.validateSDKKey(key).then(result => {
            res.status(200).send(result);
        }).catch(err => {
            res.status(500).send(`Key is not validated`);
        })
    }
});

export { router as ReportRoutes };