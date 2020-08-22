import { Router } from 'express';

import SessionsController from '../../app/controllers/SessionsController';

const sessionsRouter = Router();

sessionsRouter.post('/', SessionsController.store);

export default sessionsRouter;
