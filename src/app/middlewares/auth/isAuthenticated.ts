import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../../../config/auth';
import UsersService from '../../services/UsersService';

import AppError from '../../errors/AppError';

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
  const {
    headers: { authorization },
  } = req;

  if (!authorization) {
    throw new AppError('Access denied', 401);
  }

  const [, token] = authorization.split(' ');

  const decoded = verify(token, authConfig.jwt.secret);

  const { sub: id } = decoded as TokenPayload;

  if (!id) throw new AppError('JWT subject is missing', 401);

  if (!(await new UsersService().exists(id)))
    throw new AppError('Provided user does not exists', 401);

  req.user = {
    id,
  };

  return next();
}
