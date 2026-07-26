"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploader = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const customError_utils_1 = __importDefault(require("../utils/customError.utils"));
const uploader = () => {
    const folder = 'uploads/';
    const fileSize = 5 * 1024 * 1024; // 5mb in bytes
    const allowed_Extentions = ['.png', '.jpg', '.webp', '.jpeg', '.svg', '.pdf'];
    const allowed_mimetypes = ['image/png', 'image/jpg', 'image/webp', 'image/jpeg', 'image/svg+xml', 'application/pdf'];
    // create folder is not exists
    if (!fs_1.default.existsSync(folder)) {
        fs_1.default.mkdirSync(folder, { recursive: true });
    }
    // multer diskStorage
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, folder);
        },
        filename: (req, file, cb) => {
            const fileName = Date.now() + '-' + file.originalname;
            cb(null, fileName);
        },
    });
    //file filter
    const fileFilter = (req, file, cb) => {
        const file_ext = path_1.default.extname(file.originalname).toLocaleLowerCase();
        console.log(file);
        //check if file ext is allowed
        if (!allowed_Extentions.includes(file_ext)) {
            cb(new customError_utils_1.default(`Invalid file extention.Only ${allowed_Extentions.join(",")} are allowed.`, 400));
            return;
        }
        //check if file types is allowed
        if (!allowed_mimetypes.includes(file.mimetype)) {
            cb(new customError_utils_1.default(`Invalid file format.Only ${allowed_mimetypes.join(",")} are allowed.`, 400));
            return;
        }
        cb(null, true); //upload current file
    };
    //multer upload instance
    const upload = (0, multer_1.default)({
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: fileSize,
        }
    });
    return upload;
};
exports.uploader = uploader;
