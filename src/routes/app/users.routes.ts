import { Router } from 'express';

import UsersController from '../../app/controllers/UsersController';
import RegisterController from '../../app/controllers/RegisterController';

const usersRouter = Router();

usersRouter.post('/', UsersController.store);

usersRouter.get('/', UsersController.list);

usersRouter.post('/register', RegisterController.store);

export default usersRouter;
