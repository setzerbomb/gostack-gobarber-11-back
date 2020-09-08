import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

const tmpFolder = resolve(__dirname, '..', '..', 'tmp');

export default {
  tmpFolder,
  uploadsFolder: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
  storage: multer.diskStorage({
    destination: resolve(tmpFolder),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err, file.originalname);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
