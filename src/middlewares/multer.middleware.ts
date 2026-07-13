import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import fs from 'fs';
import path from 'path';
import AppError from '../utils/customError.utils';



export const uploader = () => {

    const folder = 'uploads/';
    const fileSize = 5 * 1024 * 1024; // 5mb in bytes
    const allowed_Extentions = ['.png', '.jpg', '.webp', '.jpeg', '.svg', '.pdf'];
    const allowed_mimetypes = ['image/png', 'image/jpg', 'image/webp', 'image/jpeg', 'image/svg+xml', 'application/pdf'];

    // create folder is not exists
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }

    // multer diskStorage
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, folder);
        },

        filename: (req, file, cb) => {
            const fileName = Date.now() + '-' + file.originalname;
            cb(null, fileName);
        },
    });

    //file filter
    const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {

        const file_ext = path.extname(file.originalname);
        console.log(file);

        //check if file ext is allowed
        if (!allowed_Extentions.includes(file_ext)) {
            cb(
                new AppError(`Invalid file extention.Only ${allowed_Extentions.join(",")} are allowed.`,
                400,
            ),
            );
            return;
        }

        //check if file types is allowed
        if (!allowed_mimetypes.includes(file.mimetype)) {
            cb(new AppError(`Invalid file format.Only ${allowed_mimetypes.join(",")} are allowed.`,
                400,
            ),
            );
            return;
        }
        cb(null, true); //upload current file

    }

    //multer upload instance
    const upload = multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: fileSize,
        }
    });
    return upload;
};