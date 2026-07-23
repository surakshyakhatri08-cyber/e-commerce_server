import express, { Router } from 'express';
import {
    createBrand,
    deleteBrand,
    getAllBrands,
    getBrandById,
    updateBrand
} from '../controllers/brand.controller';
import { uploader } from '../middlewares/multer.middleware';
import { authencate } from '../middlewares/authenticate.middleware';
import { Role } from '../@types/enum.types';


const router: Router = express.Router();

// multer uploader
const upload = uploader();

router.get('/', getAllBrands);
router.get('/:id', getBrandById);
router.post('/', upload.single('logo_image'), authencate([Role.ADMIN, Role.SUPER_ADMIN]), createBrand);
router.put('/:id', upload.single('logo_image'), authencate([Role.ADMIN, Role.SUPER_ADMIN]), updateBrand);
router.delete('/:id', authencate([Role.ADMIN, Role.SUPER_ADMIN]), deleteBrand);

export default router;