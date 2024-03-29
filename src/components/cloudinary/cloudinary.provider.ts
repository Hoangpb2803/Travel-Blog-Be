import { v2 as cloudinary } from 'cloudinary';
import { E_Cloudinary } from 'src/constant/enum';

export const CloudinaryProvider = {
    provide: E_Cloudinary.CLOUDINARY,
    useFactory: (): void => {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        });
    },
};

