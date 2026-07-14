import express, { Router } from 'express';
import {
    createBrand,
    deleteBrand,
    getAllBrands,
    getBrandById,
    updateBrand
} from '../controllers/brand.controller';
import { uploader } from '../middlewares/multer.middleware';


const router: Router = express.Router();

// multer uploader
const upload = uploader();

router.get('/', getAllBrands);
router.get('/:id', getBrandById);
router.post('/', upload.single('logo_image'), createBrand);
router.put('/:id', upload.single('logo_image'), updateBrand);
router.delete('/:id', deleteBrand);

export default router;