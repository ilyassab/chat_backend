import express from 'express';
import io from 'socket.io';
import {validationResult} from "express-validator";
import bcrypt from 'bcrypt';

import {UserModel} from '../models';
import {createJWToken} from "../utils";

class UserController {
    io: io.Server;
    constructor(io: io.Server) {
        this.io = io;
    }

    show(req: express.Request, res: express.Response) {
        const id: string = req.params.id;
        UserModel.findById(id, (err, user) => {
            if (err || !user) {
                return res.status(404).json({message: 'User not found'});
            }
            res.json(user);
        })
    }

    getMe(req: express.Request, res: express.Response) {
        const id: string = req.user._id;
        UserModel.findById(id, (err, user) => {
            if (err) {
                return res.status(404).json({message: 'User not found'});
            }
            res.json(user);
        })
    }

    findUsers(req: express.Request, res: express.Response) {
        const query: string = req.query.query;
        UserModel
        .find()
        .or([{fullname: new RegExp(query, 'i')}, {email: new RegExp(query, 'i')}])
        .then(users => res.json(users))
        .catch(err => {
            return res.status(404).json({message: 'User not found'});
        });
    }

    verify(req: express.Request, res: express.Response) {
        const hash: string = req.query.hash;
        UserModel.findOne({confirm_hash: hash}, (err, user: any) => {
            if (err || !user) {
                return res.status(404).json({message: 'User not found'});
            }
            user.confirmed = true;
            user.save((err: any) => {
                if (err) {
                    res.status(404).json({
                        status: "error",
                        message: err
                    });
                } else {
                    res.json({
                        status: "success",
                    });
                }
            })
        })
    }

    create(req: express.Request, res: express.Response) {
        const postData = {
            email: req.body.email,
            fullname: req.body.fullname,
            password: req.body.password,
        };
        const user = new UserModel(postData);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: 'error',
                errors: errors.array()
            });
        }

        user.save().then((obj: any) => {
            res.json(obj);
        }).catch(reason => {
            res.status(500).json({
                status: "error",
                message: reason
            });
        });
    }

    delete(req: express.Request, res: express.Response) {
        const id: string = req.params.id;
        UserModel.findByIdAndRemove({_id: id})
            .then(user => user && res.json({
                message: `User ${user.fullname} deleted`
            }))
            .catch(err => res.status(404).json({message: 'User not found'}));
    }

    login(req: express.Request, res: express.Response) {
        const postData = {
            email: req.body.email,
            password: req.body.password
        };

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: 'error',
                errors: errors.array()
            });
        }

        UserModel.findOne({email: postData.email}, (err, user: any) => {

            if (err || !user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found'
                });
            }

            bcrypt.compare(postData.password, user.password)
                .then((result) => {
                    if (result) {
                        const token = createJWToken(user);
                        res.json({
                            status: 'success',
                            token
                        })
                    } else {
                        res.json({
                            status: "error",
                            message: "Incorrect password or email"
                        })
                    }
                })
                .catch(err => {
                    res.status(404).json({
                        status: 'error'
                    });
                })
        });
    }
}

export default UserController;