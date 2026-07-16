import 'dotenv/config';

const ENV_CONFIG = {
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI!!,
    NODE_ENV: process.env.NODE_ENV,

    // Cloudinary
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

    // jwt
    JWT_SECRET: process.env.JWT_SECRET!!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN!!,

    //  cookie
    COOKIE_EXPIRY: Number(process.env.COOKIE_EXPIRY) ?? 7,
};

export default ENV_CONFIG;