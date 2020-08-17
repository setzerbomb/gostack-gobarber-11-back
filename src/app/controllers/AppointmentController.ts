import { Request, Response } from 'express';

import message from '../common/message';

import AppointmentsService from '../services/AppointmentsService';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

const AppointmentController = () => {
  const appointmentsService: AppointmentsService = new AppointmentsService({
    appointmentRepository: new AppointmentsRepository(),
  });

  const self = {
    store: (req: Request, res: Response) => {
      const { provider, date } = req.body;

      try {
        return res.json(appointmentsService.store({ provider, date }));
      } catch (e) {
        return message(res, 400, e.message);
      }
    },
    list: (req: Request, res: Response) => {
      return res.json(appointmentsService.list());
    },
  };

  return self;
};

export default AppointmentController();
