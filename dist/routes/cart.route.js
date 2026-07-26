"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("../controllers/cart.controller");
const authenticate_middleware_1 = require("../middlewares/authenticate.middleware");
const router = express_1.default.Router();
router.get('/', (0, authenticate_middleware_1.authencate)(), cart_controller_1.getMyCart);
router.post('/', (0, authenticate_middleware_1.authencate)(), cart_controller_1.addToCart);
router.put('/item', (0, authenticate_middleware_1.authencate)(), cart_controller_1.updateCartItemQuantity);
router.delete('/item/:productId', (0, authenticate_middleware_1.authencate)(), cart_controller_1.removeFromCart);
router.delete('/clear', (0, authenticate_middleware_1.authencate)(), cart_controller_1.clearCart);
exports.default = router;
