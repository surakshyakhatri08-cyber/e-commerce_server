import express, { Router } from 'express';
import { changePassword, changeProfile, getProfile, login, logout, signup } from '../controllers/auth.controller';
import { uploader } from '../middlewares/multer.middleware';
import { authencate } from '../middlewares/authenticate.middleware';




const router: Router = express.Router();


//multer uploader
const upload = uploader();

router.post('/signup',upload.single('profile_image'), signup);
router.post('/login', login);
router.get('/profile', authencate(), getProfile);
router.put('/change-password/:id', authencate(), changePassword);
router.post('/logout', logout);

//change profile image
router.put('/profile-image', authencate(), upload.single('profile_image'),changeProfile);


export default router;