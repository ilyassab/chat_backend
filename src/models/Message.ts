import mongoose, {Schema, Document} from "mongoose";
import validator from 'validator';

export interface IMessage extends Document {
    text: {
        type: string;
        required: boolean;
    };
    dialog: {
        type: Schema.Types.ObjectId;
        ref: string;
        required: boolean;
    };
    user: {
        type: Schema.Types.ObjectId;
        ref: string;
        required: boolean;
    };
    read: {
        type: boolean;
        default: boolean;
    };
}

const MessageSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    dialog: {
        type: Schema.Types.ObjectId,
        ref: "Dialog",
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    read: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);

export default MessageModel;