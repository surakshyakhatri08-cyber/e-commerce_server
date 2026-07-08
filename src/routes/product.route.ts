import express, { Router } from 'express';
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct
} from '../controllers/product.controller';

const router: Router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;