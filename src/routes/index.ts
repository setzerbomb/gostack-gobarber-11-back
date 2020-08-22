import { Router } from 'express';

import appointmentsRouter from './app/appointments.routes';
import usersRouter from './app/users.routes';
import sessionsRouter from './app/sessions.routes';

import isTokenValid from '../middlewares/auth/isTokenValid';

const routes = Router();

routes.use('/appointments', isTokenValid, appointmentsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);

export default routes;
