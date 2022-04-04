import express, { Response, NextFunction } from 'express';
import { basicAuth } from '../middleware/AuthService';

const router = express.Router();

router.get('/hello', basicAuth, (req: any, res:Response, next :NextFunction) => {
    res.status(200).send(`Hello ${req.user.firstName} ${req.user.lastName}`);
});

export {router as UserRoutes};