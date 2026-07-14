import { v2 as cloudinary } from 'cloudinary';
import ENV_CONFIG from './env.config';


cloudinary.config({ 
  cloud_name: ENV_CONFIG.cloud_name, 
  api_key: ENV_CONFIG.api_key, 
  api_secret: ENV_CONFIG.api_secret,
});

export default cloudinary;