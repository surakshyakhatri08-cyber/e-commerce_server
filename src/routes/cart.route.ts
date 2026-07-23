import express, { Router } from 'express';
import {
    addToCart,
    clearCart,
    getMyCart,
    removeFromCart,
    updateCartItemQuantity
} from '../controllers/cart.controller';
import { authencate } from '../middlewares/authenticate.middleware';

const router: Router = express.Router();

router.get('/', authencate(), getMyCart);
router.post('/', authencate(), addToCart);
router.put('/item', authencate(), updateCartItemQuantity);
router.delete('/item/:productId', authencate(), removeFromCart);
router.delete('/clear', authencate(), clearCart);

export default router;