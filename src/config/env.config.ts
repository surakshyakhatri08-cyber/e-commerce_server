import 'dotenv/config';

const ENV_CONFIG = {
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI!!,

    // Cloudinary
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

    // jwt
    JWT_SECRET: process.env.JWT_SECRET!!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN!!,
};

export default ENV_CONFIG;