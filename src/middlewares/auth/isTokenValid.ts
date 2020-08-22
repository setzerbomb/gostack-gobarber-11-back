import { Request, Response, NextFunction } from 'express';
import { verify, JwtHeader } from 'jsonwebtoken';
import authConfig from '../../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function isTokenValid(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const {
    headers: { authorization },
  } = req;

  if (!authorization) {
    throw new Error('Access denied');
  }

  const [, token] = authorization.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as TokenPayload;

    req.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new Error('Invalid JWT Token');
  }
}
