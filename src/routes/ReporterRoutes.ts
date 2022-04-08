import express, { Response, NextFunction } from 'express';
import { basicAuth } from '../middleware/AuthService';
import { ReporterService } from '../services/ReporterService';

const router = express.Router();
const reporterService: ReporterService = new ReporterService();

router.post('/createTicket', basicAuth, (req: any, res:Response, next :NextFunction) => {
    if (!req.files) {
        res.status(400).send('No file uploaded');
    } else {
        const description = req.body.description
        const userId = req.body.userId
        
        reporterService.createNewTicketWithAttachments(userId, description, req.files.file).then(result => {
            res.status(200).send(result);
        }).catch(err => {
            res.status(500).send(`Ticket not created`);
        })
    }
});

export {router as ReportRoutes};