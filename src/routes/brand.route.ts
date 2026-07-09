import express, { Router } from 'express';
import {
    createBrand,
    deleteBrand,
    getAllBrands,
    getBrandById,
    updateBrand
} from '../controllers/brand.controller';

const router: Router = express.Router();

router.get('/', getAllBrands);
router.get('/:id', getBrandById);
router.post('/', createBrand);
router.put('/:id', updateBrand);
router.delete('/:id', deleteBrand);

export default router;