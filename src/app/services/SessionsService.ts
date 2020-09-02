import { getCustomRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '../../config/auth';

import UsersRepository from '../repositories/UsersRepository';
import FilesService from './FilesService';

import AppError from '../errors/AppError';

import File from '../models/File';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: {
    name: string;
    updatedAt: Date;
    avatar: { url: string } | undefined;
  };
  token: string;
}

class SessionsService {
  private getRepository() {
    return getCustomRepository(UsersRepository);
  }

  public async auth({ email, password }: Request): Promise<Response> {
    const repository = this.getRepository();

    const user = await repository.findByEmail(email);

    if (user) {
      const passwordMatched = await compare(password, user.password);

      if (passwordMatched) {
        delete user.password;
        const { id, name, updatedAt, avatarId } = user;
        const avatar = avatarId
          ? await new FilesService().find(avatarId)
          : null;
        if (avatar) delete avatar.file;

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
          expiresIn,
          subject: id,
        });

        return { user: { name, updatedAt, avatar }, token };
      }
    }

    throw new AppError('Incorrect Email or Password');
  }
}

export default SessionsService;
