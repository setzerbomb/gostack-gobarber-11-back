import { Request, Response, response } from 'express';

import message from '../common/message';

import UsersService from '../services/UsersService';

const UserController = () => {
  const usersService: UsersService = new UsersService();

  const self = {
    store: async (req: Request, res: Response) => {
      const { name, email, password } = req.body;

      try {
        const user = await usersService.store({
          name,
          email,
          password,
        });

        return res.json(user);
      } catch (e) {
        return message(res, 400, e.message);
      }
    },
  };

  return self;
};

export default UserController();
