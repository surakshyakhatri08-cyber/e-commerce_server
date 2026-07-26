"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const brand_controller_1 = require("../controllers/brand.controller");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const authenticate_middleware_1 = require("../middlewares/authenticate.middleware");
const enum_types_1 = require("../@types/enum.types");
const router = express_1.default.Router();
// multer uploader
const upload = (0, multer_middleware_1.uploader)();
router.get('/', brand_controller_1.getAllBrands);
router.get('/:id', brand_controller_1.getBrandById);
router.post('/', upload.single('logo_image'), (0, authenticate_middleware_1.authencate)([enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), brand_controller_1.createBrand);
router.put('/:id', upload.single('logo_image'), (0, authenticate_middleware_1.authencate)([enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), brand_controller_1.updateBrand);
router.delete('/:id', (0, authenticate_middleware_1.authencate)([enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), brand_controller_1.deleteBrand);
exports.default = router;
