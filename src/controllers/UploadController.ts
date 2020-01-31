import express from 'express';
import {FileModel} from '../models';

class UploadController {

    create = (req: express.Request, res: express.Response) => {
        const userId = req.user._id;
        console.log(req.file);
        const file: any = req.file;
        const fileData = {
            filename: file.originalname,
            size: file.bytes,
            ext: file.format,
            url: file.url,
            user: userId
        }
        
        const uploadedFile = new FileModel(fileData);

        uploadedFile
        .save()
        .then((fileObj: any) => {
            res.json({
                status: 'success',
                file: fileObj
            })
        })
        .catch((err: any) => {
            res.status(500).json({
                status: 'error',
                file: err
            })
        })

    }
    
    delete = (req: express.Request, res: express.Response) => {
        
    }

}

export default UploadController;