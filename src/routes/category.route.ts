import express, { Router } from 'express';
import { createCategory, deleteCategory, getAllCategory, getCategoryById, updateCategory } from '../controllers/category.controller';
import { uploader } from '../middlewares/multer.middleware';
import { authencate } from '../middlewares/authenticate.middleware';
import { Role } from '../@types/enum.types';

const router: Router = express.Router();

const upload = uploader();

router.get('/', getAllCategory);
router.get('/:id', getCategoryById);
router.post('/', upload.single('image'), authencate([Role.ADMIN, Role.SUPER_ADMIN]), createCategory);
router.put('/:id', upload.single('image'), authencate([Role.ADMIN, Role.SUPER_ADMIN]),updateCategory);
router.delete('/:id', authencate([Role.ADMIN, Role.SUPER_ADMIN]), deleteCategory);

export default router;
