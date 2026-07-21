import mongoose, { Document, Schema } from "mongoose";

interface IWishlist extends Document {
        user: mongoose.Types.ObjectId;
        product: mongoose.Types.ObjectId;
}

const wishlistSchema: Schema = new mongoose.Schema<IWishlist>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "auth_user",
        required: [true, "Product is required"],
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: [true, "Product is required"],
    }
});

const WishList = mongoose.model<IWishlist>('wishlist', wishlistSchema);

export default WishList;