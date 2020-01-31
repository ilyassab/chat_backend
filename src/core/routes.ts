import express from 'express';
import io from 'socket.io';
import bodyParser from "body-parser";

import {checkAuth, updateLastSeen} from "../middleware";
import {DialogCtrl, MessageCtrl, UserCtrl, UploadCtrl} from "../controllers";

import parser from '../core/cloudinary';

import {loginValidations, registerValidations} from "../utils/validations";

export default (app: express.Express, io: io.Server) => {
    const UserController = new UserCtrl(io);
    const DialogController = new DialogCtrl(io);
    const MessageController = new MessageCtrl(io);
    const UploadController = new UploadCtrl();

    app.use(bodyParser.json());
    app.use(checkAuth);
    app.use(updateLastSeen);

    app.get('/user/me', UserController.getMe);
    app.get('/user/verify', UserController.verify);
    app.post('/user/register', registerValidations, UserController.create);
    app.post('/user/login', loginValidations, UserController.login);
    app.get('/user/find', UserController.findUsers);
    app.delete('/user/:id', UserController.delete);
    app.get('/user/:id', UserController.show);

    app.get('/dialogs', DialogController.index);
    app.post('/dialogs', DialogController.create);
    app.delete('/dialogs/:id', DialogController.delete);

    app.get('/messages', MessageController.index);
    app.post('/messages', MessageController.create);
    app.delete('/messages/:id', MessageController.delete);

    app.post('/files', parser.single('image'), UploadController.create);
    app.delete('/files/:id', UploadController.delete);
}