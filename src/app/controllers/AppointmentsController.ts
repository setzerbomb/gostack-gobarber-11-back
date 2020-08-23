import { Request, Response } from 'express';

import message from '../common/message';

import AppointmentsService from '../services/AppointmentsService';

const AppointmentController = () => {
  const appointmentsService: AppointmentsService = new AppointmentsService();

  const self = {
    store: async (req: Request, res: Response) => {
      const { providerId, date } = req.body;

      return res.json(await appointmentsService.store({ providerId, date }));
    },
    list: async (req: Request, res: Response) => {
      return res.json(await appointmentsService.list());
    },
  };

  return self;
};

export default AppointmentController();
