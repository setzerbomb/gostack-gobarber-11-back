import { Router } from 'express';

import AppointmentController from '../app/controllers/AppointmentController';

const appointmentsRouter = Router();

appointmentsRouter.post('/', AppointmentController.store);

appointmentsRouter.get('/', AppointmentController.list);

export default appointmentsRouter;
