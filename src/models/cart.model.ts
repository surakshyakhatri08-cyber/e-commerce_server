import mongoose, { Document } from "mongoose";

interface ICartItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
}
interface ICart extends Document {
    user: mongoose.Types.ObjectId;
    items: ICartItem[],
}

const cartSchema = new mongoose.Schema<ICart>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'auth_user',
        required: [true, 'User is required'],
    },

    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required: [true, 'Product is required'],
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [1, 'Quantity cannot be less than 1'],
            default: 1,
        }
    }],
}, { timestamps: true });

const Cart = mongoose.model<ICart>('cart', cartSchema);

export default Cart;