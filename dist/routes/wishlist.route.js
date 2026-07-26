"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wishlist_controller_1 = require("../controllers/wishlist.controller");
const enum_types_1 = require("../@types/enum.types");
const authenticate_middleware_1 = require("../middlewares/authenticate.middleware");
const router = express_1.default.Router();
router.get('/', (0, authenticate_middleware_1.authencate)([enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), wishlist_controller_1.getMyWishlist);
router.post('/', (0, authenticate_middleware_1.authencate)([enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), wishlist_controller_1.createWishlist);
router.delete('/:id', (0, authenticate_middleware_1.authencate)([enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), wishlist_controller_1.deleteWishlist);
exports.default = router;
