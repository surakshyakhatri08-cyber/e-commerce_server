import express, { Router } from 'express';
import { login, signup } from '../controllers/auth.controller';
import { uploader } from '../middlewares/multer.middleware';




const router: Router = express.Router();


//multer uploader
const upload = uploader();

router.post('/signup',upload.single('profile_image'), signup);
router.post('/login', login);

export default router;