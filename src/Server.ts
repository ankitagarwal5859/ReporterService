import express, {Request, Response} from 'express';
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
import bodyParser from 'body-parser';
import { ReportRoutes } from './routes/ReporterRoutes';

class Server {
    constructor() {
        this.start();
    }

    private start() {
        // Create a new express app instance
        const app: express.Application = express();
        const port = process.env.PORT || 8080;

        // Allow body parsing
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        // Enable files upload
        app.use(fileUpload({ createParentPath: true }));

        // Add other middleware
        app.use(cors());
        app.use(morgan('dev'));

        app.use('/api/v1/report', ReportRoutes);

        app.get('/', function (req: Request, res: Response) {
            let static_response: String = 'Reporter Service'
            res.status(200).send( static_response);
        });

        app.listen(port, () => {
            console.log(`App is listening at ${port} port!`)
        });
    }
}

export default new Server();