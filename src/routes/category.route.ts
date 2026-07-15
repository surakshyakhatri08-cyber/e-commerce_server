import express, { Router } from 'express';
import { createCategory, deleteCategory, getAllCategory, getCategoryById, updateCategory } from '../controllers/category.controller';
import { uploader } from '../middlewares/multer.middleware';

const router: Router = express.Router();

const upload = uploader();

router.get('/', getAllCategory);
router.get('/:id', getCategoryById);
router.post('/', upload.single('image'), createCategory);
router.put('/:id', upload.single('image'),updateCategory);
router.delete('/:id', deleteCategory);

export default router;
