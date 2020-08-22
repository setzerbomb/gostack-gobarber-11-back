import { Request, Response } from 'express';

import message from '../common/message';

import SessionsService from '../services/SessionsService';

const SessionController = () => {
  const sessionsService = new SessionsService();

  const self = {
    store: async (req: Request, res: Response) => {
      try {
        const { email, password } = req.body;

        const { user, token } = await sessionsService.auth({ email, password });

        return res.json({ user, token });
      } catch (e) {
        return message(res, 400, e.message);
      }
    },
  };

  return self;
};

export default SessionController();
