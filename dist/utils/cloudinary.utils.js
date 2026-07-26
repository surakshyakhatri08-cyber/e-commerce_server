"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileFromCloudinary = exports.upload = void 0;
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config"));
const fs_1 = __importDefault(require("fs"));
const upload = async (file, dir = '/') => {
    try {
        const folder = 'uploads' + dir;
        const { secure_url: path, public_id } = await cloudinary_config_1.default.uploader.upload(file.path, {
            resource_type: "auto",
            unique_filename: true,
            folder,
            transformation: {
                width: 800,
                height: 800,
                crop: 'fill',
                fetch_format: 'auto',
                gravity: 'face',
                format: 'auto'
            },
        });
        // delete from local uploads folder
        if (fs_1.default.existsSync(file.path)) {
            fs_1.default.unlinkSync(file.path);
        }
        return {
            path,
            public_id
        };
    }
    catch (error) {
        console.log(error);
        throw new Error('Something went wrong');
    }
};
exports.upload = upload;
// delete file from cloudinary
const deleteFileFromCloudinary = async (public_id) => {
    try {
        await cloudinary_config_1.default.uploader.destroy(public_id);
        return true;
    }
    catch (error) {
        console.log(error);
    }
};
exports.deleteFileFromCloudinary = deleteFileFromCloudinary;
