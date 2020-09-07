import { Request, Response } from 'express';

import message from '@shared/functions/message';

import AppointmentsService from '@modules/appointments/services/AppointmentsService';
import { container } from 'tsyringe';

const AppointmentController = () => {
  const self = {
    store: async (req: Request, res: Response) => {
      const appointmentsService: AppointmentsService = container.resolve(
        AppointmentsService,
      );

      const { providerId, date } = req.body;

      return res.json(await appointmentsService.store({ providerId, date }));
    },
    list: async (req: Request, res: Response) => {
      const appointmentsService: AppointmentsService = container.resolve(
        AppointmentsService,
      );

      return res.json(await appointmentsService.list());
    },
  };

  return self;
};

export default AppointmentController();
