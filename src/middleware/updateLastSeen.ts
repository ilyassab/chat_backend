import express from 'express';
import {UserModel} from '../models';

export default (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.path === '/user/login' || req.path === '/user/register' || req.path === '/user/verify') {
        return next();
    }
    
    UserModel.findOneAndUpdate(
        {_id: req.user._id},
        {last_seen: new Date()},
        {new: true},
        () => {}
    );
    next();
}