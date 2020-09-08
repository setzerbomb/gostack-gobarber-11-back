import { Request, Response, response } from 'express';

import { container } from 'tsyringe';

import UsersService from '@modules/users/services/UsersService';
import message from '@shared/functions/message';

const UserController = () => {
  const self = {
    store: async (req: Request, res: Response) => {
      const usersService: UsersService = container.resolve(UsersService);
      const { name, email, password } = req.body;

      const user = await usersService.store({
        name,
        email,
        password,
      });

      delete user.password;

      return res.json(user);
    },
  };

  return self;
};

export default UserController();
