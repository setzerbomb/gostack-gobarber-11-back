import { Router } from 'express';

import isAuthenticated from '@shared/infra/http/middlewares/auth/isAuthenticated';
import appointmentsRouter from './app/appointments.routes';
import usersRouter from './app/users.routes';
import sessionsRouter from './app/sessions.routes';

const routes = Router();

routes.use('/appointments', isAuthenticated, appointmentsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);

export default routes;
