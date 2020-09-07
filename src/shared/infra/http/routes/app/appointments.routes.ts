import { Router } from 'express';

import AppointmentsController from '@modules/appointments/infra/express/controllers/AppointmentsController';

const appointmentsRouter = Router();

appointmentsRouter.post('/', AppointmentsController.store);

appointmentsRouter.get('/', AppointmentsController.list);

export default appointmentsRouter;
