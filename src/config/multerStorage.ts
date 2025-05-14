import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';

export function createSingleMulterStorage(
  allowImage: boolean,
  allowVideo: boolean,
) {
  return diskStorage({
    destination: './public/uploads',
    filename: (req, file, callback) => {
      if (
        (allowImage && file.mimetype.includes('image/')) ||
        (allowVideo && file.mimetype.includes('video/'))
      ) {
        callback(null, `${Date.now()}_${file.originalname}`);
        return;
      }
      callback(
        new BadRequestException('Format of the uploaded file is not allowed.'),
        '',
      );
    },
  });
}
