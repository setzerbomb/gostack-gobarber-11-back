import { Router } from 'express';

import appointmentsRouter from './app/appointments.routes';
import usersRouter from './app/users.routes';
import sessionsRouter from './app/sessions.routes';

import isAuthenticated from '../app/middlewares/auth/isAuthenticated';

const routes = Router();

routes.use('/appointments', isAuthenticated, appointmentsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);

export default routes;
