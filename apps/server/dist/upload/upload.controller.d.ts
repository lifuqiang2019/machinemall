import * as express from 'express';
export declare class UploadController {
    uploadFile(file: Express.Multer.File): {
        url: string;
    };
    getFile(filename: string, res: express.Response): void;
}
