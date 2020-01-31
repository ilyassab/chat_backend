import express from 'express';
import io from 'socket.io';
import {DialogModel, MessageModel} from '../models';

class DialogController {
    io: io.Server;
    constructor(io: io.Server) {
        this.io = io;
    }

    index = (req: express.Request, res: express.Response) => {
        const userId: string = req.user._id;
        DialogModel.find()
        .or([{partner: userId}, {author: userId}])
        .populate(["author", "partner", "lastMessage"])
        .exec()
        .then(dialogs => res.json(dialogs))
        .catch(() => res.status(404).json({
            message: "Dialogs not found"
        }))
    }

    create = (req: express.Request, res: express.Response) => {
        const postData = {
            author: req.user._id,
            partner: req.body.partner
        };
        const dialog = new DialogModel(postData);

        dialog.save().then((dialogObj: any) => {
            const message = new MessageModel({
                text: req.body.text,
                dialog: dialogObj._id,
                user: req.user._id,
            });
            
            message.save().then((messageObj: any) => {
                DialogModel.findOneAndUpdate(
                    {_id: dialogObj._id },
                    { lastMessage: messageObj._id },
                    { upsert: true },
                    (err: any, updDialog) => {
                        if (err) {
                            return res.status(500).json({
                                status: "error",
                                message: err
                            })
                        }

                        this.io.emit('SERVER:DIALOG_CREATED');

                        return res.json(updDialog);
                    }
                )
            }).catch(reason => {
                res.json(reason);
            })
        }).catch(reason => {
            res.json(reason);
        })
    }

    delete = (req: express.Request, res: express.Response) => {
        const id: string = req.params.id;
        DialogModel.findByIdAndRemove({_id: id})
            .then(dialog => dialog && res.json({
                message: `Dialog deleted`
            }))
            .catch(err => res.status(404).json({message: 'Dialog not found'}));
    }
}

export default DialogController;