import mongoose, { Document, Schema } from "mongoose";
import { ImageSchema } from "./image.model";

export interface IProduct extends Document {
    name: string;
    description?: string;
    stock: number;
    price: number;
    cover_image: {
        path: string,
        public_id: string,
    };
    brand: mongoose.Types.ObjectId;
    category: mongoose.Types.ObjectId;
    images: {
        path: string,
        public_id: string,
    }[];
    is_featured: boolean;
    newArrival: boolean;
}

const productSchema: Schema = new mongoose.Schema<IProduct>({
    name: {
        type: String,
        required: true,
        minLength: [3, 'Name must be at least 3 character'],
        trim: true,
    },

    description: {
        type: String,
        minLength: [5, 'Description length must be at least 5 character'],
        trim: true,
    },

    stock: {
        type: Number,
        required: [true, 'Stock is required'],
        min: 0,
        trim: true
    },

    price: {
        type: Number,
        required: true,
        min: 0,
        trim: true,
    },

    cover_image: {
        type: ImageSchema,
        required: [true, 'Cover Image is required'],
    },

    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "brand",
        required: [true, "Brand is required"],
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: [true, "Category is required"],
    },

    images: [ImageSchema],
    is_featured: {
        type: Boolean,
        default: false,
    },
    newArrival: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true },
);

const Product = mongoose.model<IProduct>('product', productSchema);

export default Product;