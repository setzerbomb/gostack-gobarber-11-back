import { Request, Response } from 'express';

import message from '../common/message';

import UsersService from '../services/UsersService';

const UserController = () => {
  const usersService: UsersService = new UsersService();

  const self = {
    store: async (req: Request, res: Response) => {
      return message(res, 400, 'To do');
    },
    list: async (req: Request, res: Response) => {
      return message(res, 400, 'To do');
    },
  };

  return self;
};

export default UserController();
