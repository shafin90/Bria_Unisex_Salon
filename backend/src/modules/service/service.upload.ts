import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage }  from 'multer-storage-cloudinary';
import multer  from 'multer';

cloudinary.config({
    cloud_name: 'drjlwkesp',
    api_key: '424161371495428',
    api_secret: 'QnfSUs909OsnbJWJbq2bmfIi61k'
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'services' as any,
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [{ width: 500, height: 500, crop: 'limit' } as any]
    } as any
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }
}).single('img');

export default upload;
