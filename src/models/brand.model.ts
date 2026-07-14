import mongoose, { Schema, Document } from 'mongoose';
import { ImageSchema } from './image.model';


interface IBrand extends Document {
    name: string;
    description?: string;
    logo: {
        path: string;
        public_id: string;
    };
}

const brandSchema: Schema = new Schema<IBrand>({
    name: {
        type: String,
        required: [true, 'Brand name is required'],
        trim: true,
        unique: [true, 'Brand name is already exists'],
    },
    description: {
        type: String,
        minLength: 10,
        trim: true,
    },
    logo: {
        type: ImageSchema,
        required: [true, 'Brand logo is required'],
        trim: true,
    }
}, {
    timestamps: true
});

const Brand = mongoose.model<IBrand>('brand', brandSchema);
export default Brand;