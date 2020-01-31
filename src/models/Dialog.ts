import mongoose, {Schema, Document} from "mongoose";
import validator from 'validator';

export interface IDialog extends Document {
    partner: {
        type: Schema.Types.ObjectId;
        ref: string;
        required: boolean;
    };
    author: {
        type: Schema.Types.ObjectId;
        ref: string;
        required: boolean;
    };
    lastMessage: {
        type: Schema.Types.ObjectId;
        ref: string;
    };
}

const DialogSchema = new Schema({
    partner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: 'Partner is required'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: 'Author is required'
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    },
}, {
    timestamps: true
});

const DialogModel = mongoose.model<IDialog>('Dialog', DialogSchema);

export default DialogModel;