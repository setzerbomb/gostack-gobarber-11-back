import { Request, Response, response } from 'express';

import message from '../common/message';

import UsersService from '../services/UsersService';

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
    },
  };

  return self;
};

export default UserController();
