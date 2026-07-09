import mongoose, { Schema, Document } from 'mongoose';


interface IBrand extends Document {
    name: string;
    description?: string;
    logo: string;
}

const brandSchema: Schema = new Schema<IBrand>({
    name: {
        type: String,
        required: [true, 'Brand name is required'],
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        default: null,
    },
    logo: {
        type: String,
        required: [true, 'Brand logo is required'],
        trim: true,
    }
}, {
    timestamps: true
});

const Brand = mongoose.model<IBrand>('brand', brandSchema);
export default Brand;