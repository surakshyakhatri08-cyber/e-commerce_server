import mongoose, { Document, Schema } from 'mongoose';


//user schema
interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    role: "USER" | "ADMIN";
    profile?: string;
}
const authSchema: Schema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'User already exists'],
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false,
    },

    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },

    //path and public id
    profile: {   
        type: String,
        default: null,
    }
}, {
    timestamps: true
},
);

const AuthUser = mongoose.model<IUser>('auth_user', authSchema);
export default AuthUser;