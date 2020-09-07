import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';
import UsersService from '@modules/users/services/UsersService';

import AppError from '@shared/errors/AppError';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import FilesRepository from '@modules/files/infra/typeorm/repositories/FilesRepository';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const {
      headers: { authorization },
    } = req;

    if (!authorization) {
      throw new Error('Access denied');
    }

    const [, token] = authorization.split(' ');

    const decoded = verify(token, authConfig.jwt.secret);

    const { sub: id } = decoded as TokenPayload;

    if (!id) throw new Error('JWT subject is missing');

    if (
      !(await new UsersService(
        new UsersRepository(),
        new FilesRepository(),
      ).exists(id))
    )
      throw new Error('Provided user does not exists');

    req.user = {
      id,
    };

    return next();
  } catch (e) {
    throw new AppError('Access Denied');
  }
}
