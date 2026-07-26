"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_middleware_1 = require("./../middlewares/multer.middleware");
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const authenticate_middleware_1 = require("../middlewares/authenticate.middleware");
const enum_types_1 = require("../@types/enum.types");
const router = express_1.default.Router();
const upload = (0, multer_middleware_1.uploader)();
router.get('/', product_controller_1.getAllProducts);
router.get('/:id', product_controller_1.getProductById);
router.post('/', (0, authenticate_middleware_1.authencate)([enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), upload.fields([
    {
        name: 'cover_image',
        maxCount: 1,
    },
    {
        name: 'images',
        maxCount: 5,
    },
]), product_controller_1.createProduct);
router.put('/:id', (0, authenticate_middleware_1.authencate)([enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), upload.fields([
    {
        name: 'cover_image',
        maxCount: 1,
    },
    {
        name: 'images',
        maxCount: 5,
    },
]), product_controller_1.updateProduct);
router.delete('/:id', product_controller_1.deleteProduct);
exports.default = router;
