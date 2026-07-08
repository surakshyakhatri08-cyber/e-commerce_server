import mongoose, {Schema} from "mongoose";

const productSchema: Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
    },
    quantity: {
        type: Number,
        required: true,       
    },
    price: {
        type: Number,
        required: true,
    },
});

const Product = mongoose.model('product', productSchema);

export default Product;