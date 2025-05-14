import { diskStorage, StorageEngine } from 'multer';

const multerStorage: StorageEngine = diskStorage({
  destination: './public/uploads',
  filename: (req, file, callback) => {
    if (!file.mimetype.includes('image/')) {
      callback(new Error('File uploaded is not an image.'), '');
      return;
    }
    callback(null, `${Date.now()}_${file.originalname}`);
  },
});

export default multerStorage;
