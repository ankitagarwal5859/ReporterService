import { NextFunction, Response } from "express";

function errorHandler(err: any, req: any, res: Response, next: NextFunction) {
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({ message: err });
    }

    // default to 500 server error
    return res.status(500).json({ message: err.message });
}

export {errorHandler}