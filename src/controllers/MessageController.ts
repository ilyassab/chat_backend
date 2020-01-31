import express from 'express';
import io from 'socket.io';
import {MessageModel, DialogModel} from '../models';

class MessageController {
    io: io.Server;
    constructor(io: io.Server) {
        this.io = io;
    }

    index = (req: express.Request, res: express.Response) => {
        const dialogId: string = req.query.dialog;
        const userId: string = req.user._id;

        MessageModel.updateMany({ "dialog": dialogId, "user": {'$ne': userId} }, {"$set": {'read': true}}, (err: any) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: err
                })
            }
        })

        MessageModel.find({dialog: dialogId})
            .populate(["dialog", 'user'])
            .exec()
            .then(dialogs => res.json(dialogs))
            .catch(() => res.status(404).json({
                message: "Messages not found"
            }))
    };

    create = (req: express.Request, res: express.Response) => {
        const user = req.user._id;

        const postData = {
            text: req.body.text,
            user: user,
            dialog: req.body.dialog_id,
        };
        const message = new MessageModel(postData);

        message.save()
            .then((messageObj: any) => {
                DialogModel.findOneAndUpdate(
                    {_id: postData.dialog },
                    { lastMessage: messageObj },
                    { upsert: true },
                    (err: any, doc) => {
                        if (err) {
                            return res.status(500).json({
                                status: "error",
                                message: err
                            })
                        }
                        this.io.emit('SERVER:NEW_MESSAGE');
                        return res.json(messageObj);
                    }
                )
            })
            .catch(reason => {
                res.json(reason);
            })
    };

    delete(req: express.Request, res: express.Response) {
        const id: string = req.params.id;
        const userId: string = req.user._id;

        MessageModel.findById(id, (err, message: any) => {
            if (err || !message) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Message not found'
                })
            }

            if (String(message.user) === userId) {
                const dialogId = message.dialog;
                message.remove();
                MessageModel.find({dialog: dialogId}).sort({'createdAt': -1}).limit(1)
                .then(([lastMessage]) => {
                    DialogModel.findById(dialogId, (err, dialog:any) => {
                        if (err) {
                            return res.status(500).json({
                                status: 'error',
                                message: err
                            }) 
                        }
                        dialog.lastMessage = lastMessage;
                        dialog.save();
                        return res.json({
                            status: 'success',
                            message: 'Message deleted'
                        })
                    }) 
                })
                .catch(err => {
                    return res.status(500).json({
                        status: 'error',
                        message: err
                    })
                })
            } else {
                return res.status(403).json({
                    status: 'error',
                    message: 'Forbidden'
                })
            }
        })
    };
}

export default MessageController;