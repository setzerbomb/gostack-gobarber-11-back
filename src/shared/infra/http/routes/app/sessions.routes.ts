import { Router } from 'express';

import SessionsController from '@modules/users/infra/express/controllers/SessionsController';

const sessionsRouter = Router();

sessionsRouter.post('/', SessionsController.store);

export default sessionsRouter;
