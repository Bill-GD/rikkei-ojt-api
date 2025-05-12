import { diskStorage } from 'multer';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export function multerStorageByField(baseFolder: string) {
  return diskStorage({
    destination: (req, file, cb) => {
      let subFolder = '';
      if (file.fieldname === 'image') subFolder = 'image';
      else if (file.fieldname === 'trailer') subFolder = 'trailer';
      else subFolder = 'others';

      const uploadPath = join(
        __dirname,
        '..',
        '..',
        'public',
        'uploads',
        baseFolder,
        subFolder,
      );
      if (!existsSync(uploadPath)) mkdirSync(uploadPath, { recursive: true });

      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const filename = `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
      cb(null, filename);
    },
  });
}
