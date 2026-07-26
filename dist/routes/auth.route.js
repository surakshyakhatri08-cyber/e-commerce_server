"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const authenticate_middleware_1 = require("../middlewares/authenticate.middleware");
const router = express_1.default.Router();
//multer uploader
const upload = (0, multer_middleware_1.uploader)();
router.post('/signup', upload.single('profile_image'), auth_controller_1.signup);
router.post('/login', auth_controller_1.login);
router.get('/profile', (0, authenticate_middleware_1.authencate)(), auth_controller_1.getProfile);
router.put('/change-password/:id', (0, authenticate_middleware_1.authencate)(), auth_controller_1.changePassword);
router.post('/logout', auth_controller_1.logout);
//change profile image
router.put('/profile-image', (0, authenticate_middleware_1.authencate)(), upload.single('profile_image'), auth_controller_1.changeProfile);
exports.default = router;
