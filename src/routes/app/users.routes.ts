import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../../config/multer';

import UsersController from '../../app/controllers/UsersController';
import RegisterController from '../../app/controllers/RegisterController';
import FileController from '../../app/controllers/FileController';

import isAuthenticated from '../../app/middlewares/auth/isAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.patch(
  '/avatar',
  isAuthenticated,
  upload.single('avatar'),
  FileController.store,
  UsersController.update,
);

usersRouter.post('/register', RegisterController.store);

usersRouter.get('/', isAuthenticated, UsersController.find);

export default usersRouter;
