import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/multer';

import UsersController from '@modules/users/infra/express/controllers/UsersController';
import RegisterController from '@modules/users/infra/express/controllers/RegisterController';
import FileController from '@modules/files/infra/express/controllers/FileController';

import isAuthenticated from '@shared/infra/http/middlewares/auth/isAuthenticated';

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
