"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const authenticate_middleware_1 = require("../middlewares/authenticate.middleware");
const enum_types_1 = require("../@types/enum.types");
const router = express_1.default.Router();
const upload = (0, multer_middleware_1.uploader)();
router.get('/', category_controller_1.getAllCategory);
router.get('/:id', category_controller_1.getCategoryById);
router.post('/', upload.single('image'), (0, authenticate_middleware_1.authencate)([enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), category_controller_1.createCategory);
router.put('/:id', upload.single('image'), (0, authenticate_middleware_1.authencate)([enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), category_controller_1.updateCategory);
router.delete('/:id', (0, authenticate_middleware_1.authencate)([enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), category_controller_1.deleteCategory);
exports.default = router;
