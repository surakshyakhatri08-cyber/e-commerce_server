import mongoose, {Document, Schema} from "mongoose";
import { ImageSchema } from "./image.model";

interface ICategory extends Document{
    name: string;
    description: string;
    image: {
        path: string,
        public_id: string,
    };
}

const categorySchema: Schema = new mongoose.Schema<ICategory>({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },

    description: {
        type: String,
        minLength: [5, 'Description length must be at least 5 character'],
        trim: true,
    },

    image: {
        type: ImageSchema,
        required: [true, 'Image is required'],
        trim: true,
    },
});

const Category = mongoose.model<ICategory> ('category', categorySchema);

export default Category;