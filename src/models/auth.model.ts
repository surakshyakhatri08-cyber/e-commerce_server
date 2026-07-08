import mongoose, { Schema } from 'mongoose';

const authSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    profile: {
        type: String,
        required: false,
        default: '',
    }
},
);

const AuthUser = mongoose.model('auth_user', authSchema);
export default AuthUser;