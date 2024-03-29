import express from 'express';
import {verifyJWToken} from '../utils';

export default (req: any, res: express.Response, next: any) => {

    if (req.path === '/user/login' || req.path === '/user/register' || req.path === '/user/verify' || !/(user)|(files)|(dialogs)|(messages)/.test(req.path)) {
        return next();
    }

    const token = req.headers.token;

    verifyJWToken(token)
        .then((user: any) => {
            req.user = user.data._doc;
            next();
        })
        .catch(() => {
           res.status(403).json({
               message: 'Invalid auth token provided'
           })
        });
}