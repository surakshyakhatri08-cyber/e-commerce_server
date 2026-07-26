"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const brand_route_1 = __importDefault(require("./routes/brand.route"));
const category_route_1 = __importDefault(require("./routes/category.route"));
const wishlist_route_1 = __importDefault(require("./routes/wishlist.route"));
const cart_route_1 = __importDefault(require("./routes/cart.route"));
const errorHandler_middleware_1 = require("./middlewares/errorHandler.middleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
//health route
app.get('/', (req, res) => {
    res.status(200).json({
        message: "server is up and running",
        status: "success",
        success: true,
        data: null,
    });
});
app.use('/api/products', product_route_1.default);
app.use('/api/auth', auth_route_1.default);
app.use('/api/brands', brand_route_1.default);
app.use('/api/categories', category_route_1.default);
app.use('/api/wishlists', wishlist_route_1.default);
app.use('/api/carts', cart_route_1.default);
//path not found
app.use((req, res, next) => {
    const message = `Can not ${req.method} on ${req.path}`;
    const error = new Error(message);
    error.status = 'failed';
    error.statusCode = 404;
    next(error);
});
//error handling middleware
app.use(errorHandler_middleware_1.errorHandler);
exports.default = app;
