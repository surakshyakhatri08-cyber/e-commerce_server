import { uploader } from './../middlewares/multer.middleware';
import express, { Router } from 'express';
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct
} from '../controllers/product.controller';
import { authencate } from '../middlewares/authenticate.middleware';
import { Role } from '../@types/enum.types';

const router: Router = express.Router();

const upload = uploader();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authencate([Role.ADMIN, Role.SUPER_ADMIN]), upload.fields([
    {
        name: 'cover_image',
        maxCount: 1,
    },
    {
        name: 'images',
        maxCount: 5,
    },
]), createProduct);
router.put('/:id', authencate([Role.ADMIN, Role.SUPER_ADMIN]), upload.fields([
    {
        name: 'cover_image',
        maxCount: 1,
    },
   {
     name: 'images',
     maxCount: 5,
   },
]),updateProduct);
router.delete('/:id', deleteProduct);

export default router;