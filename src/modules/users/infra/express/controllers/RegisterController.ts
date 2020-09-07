import { Request, Response, response } from 'express';

import UsersService from '@modules/users/services/UsersService';
import message from '@shared/functions/message';

const UserController = () => {
  const usersService: UsersService = new UsersService();

  const self = {
    store: async (req: Request, res: Response) => {
      const { name, email, password } = req.body;

      const user = await usersService.store({
        name,
        email,
        password,
      });

      return res.json(user);
    },
  };

  return self;
};

export default UserController();
