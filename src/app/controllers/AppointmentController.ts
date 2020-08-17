import { Request, Response } from 'express';

import message from '../common/message';

import AppointmentsService from '../services/AppointmentsService';

const AppointmentController = () => {
  const appointmentsService: AppointmentsService = new AppointmentsService();

  const self = {
    store: async (req: Request, res: Response) => {
      const { provider, date } = req.body;

      try {
        return res.json(await appointmentsService.store({ provider, date }));
      } catch (e) {
        return message(res, 400, e.message);
      }
    },
    list: async (req: Request, res: Response) => {
      return res.json(await appointmentsService.list());
    },
  };

  return self;
};

export default AppointmentController();
