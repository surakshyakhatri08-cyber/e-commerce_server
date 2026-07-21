import express, { Router } from 'express';
import { createWishlist, deleteWishlist, getMyWishlist } from '../controllers/wishlist.controller';
import { Role } from '../@types/enum.types';
import { authencate } from '../middlewares/authenticate.middleware';

const router: Router = express.Router();

router.get('/', authencate([Role.ADMIN, Role.SUPER_ADMIN]), getMyWishlist);
router.post('/', authencate([Role.ADMIN, Role.SUPER_ADMIN]), createWishlist);
router.delete('/:id',authencate([Role.ADMIN, Role.SUPER_ADMIN]), deleteWishlist);

export default router;