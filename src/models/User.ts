import mongoose, {Schema, Document} from "mongoose";
import validator from 'validator';
import {generatePasswordHash} from '../utils';

export interface IUser extends Document {
    email: string;
    avatar?: string;
    fullname: string;
    password: string;
    confirmed?: boolean;
    confirm_hash?: string;
    last_seen?: string;
}

//TODO: Сделать последнее посещение
const UserSchema = new Schema({
    email: {
        type: String,
        required: 'Email address is required',
        unique: true,
        validate: [validator.isEmail, "Invalid email"]
    },
    avatar: String,
    fullname: {
        type: String,
        required: 'Fullname address is required'
    },
    password: {
        type: String,
        required: 'Password address is required'
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    confirm_hash: String,
    last_seen: {
        type: Date,
        default: new Date()
    }
}, {
    timestamps: true
});

UserSchema.pre('save', function(next) {
    const user: any = this;

    if (!user.isModified('password')) return next();

    generatePasswordHash(user.password).then(hash =>{
        user.password = String(hash);
        generatePasswordHash(`${Date.now()}`).then(hash => {
            user.confirm_hash = String(hash);
            next();
        })
    }).catch(err => {
        next(err);
    })
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;