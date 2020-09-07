import { Request, Response } from 'express';

import message from '@shared/functions/message';

import UsersService from '@modules/users/services/UsersService';

const UserController = () => {
  const usersService: UsersService = new UsersService();

  const self = {
    update: async (req: Request, res: Response) => {
      const {
        fileId: avatar,
        body: { name, password, passwordConfirmation },
      } = req;
      const user = await usersService.update(
        req.user.id,
        name,
        password,
        passwordConfirmation,
        avatar,
      );

      return res.json(user);
    },
    find: async (req: Request, res: Response) => {
      const user = await usersService.find(req.user.id);
      delete user?.password;
      return res.json(user);
    },
  };

  return self;
};

export default UserController();
