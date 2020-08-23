import { Request, Response } from 'express';

import message from '../common/message';

import UsersService from '../services/UsersService';

const UserController = () => {
  const usersService: UsersService = new UsersService();

  const self = {
    update: async (req: Request, res: Response) => {
      const {
        fileId: avatar,
        params: { id },
        body: { name, password, passwordConfirmation },
      } = req;
      const user = await usersService.update(
        id,
        name,
        password,
        passwordConfirmation,
        avatar,
      );

      return res.json(user);
    },
  };

  return self;
};

export default UserController();
