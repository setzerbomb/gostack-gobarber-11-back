import { Request, Response } from 'express';

import message from '@shared/functions/message';

import SessionsService from '@modules/users/services/SessionsService';

const SessionController = () => {
  const sessionsService = new SessionsService();

  const self = {
    store: async (req: Request, res: Response) => {
      const { email, password } = req.body;

      const { user, token } = await sessionsService.auth({ email, password });

      return res.json({ user, token });
    },
  };

  return self;
};

export default SessionController();