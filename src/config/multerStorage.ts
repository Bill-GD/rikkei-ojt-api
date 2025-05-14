import { diskStorage } from 'multer';

export default function createSingleMulterStorage(allowImage: boolean, allowVideo: boolean) {
  return diskStorage({
    destination: './public/uploads',
    filename: (req, file, callback) => {
      if (allowImage && !file.mimetype.includes('image/')) {
        callback(new Error('File uploaded is not an image.'), '');
        return;
      }
      if (allowVideo && !file.mimetype.includes('video/')) {
        callback(new Error('File uploaded is not a video.'), '');
        return;
      }
      callback(null, `${Date.now()}_${file.originalname}`);
    },
  });
}
