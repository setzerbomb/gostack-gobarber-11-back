import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';

import IUsersRepository from '@modules/users/interfaces/repositories/IUsersRepository';
import IFilesRepository from '@modules/files/interfaces/repositories/IFilesRepository';

import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    updatedAt: Date;
    avatar: { url: string } | null;
  };
  token: string;
}

@injectable()
class SessionsService {
  private usersRepository: IUsersRepository;

  private filesRepository: IFilesRepository;

  constructor(
    @inject('UsersRepository') usersRepository: IUsersRepository,
    @inject('FilesRepository') filesRepository: IFilesRepository,
  ) {
    this.filesRepository = filesRepository;
    this.usersRepository = usersRepository;
  }

  private getRepository() {
    return this.usersRepository;
  }

  public async auth({ email, password }: IRequest): Promise<IResponse> {
    const repository = this.getRepository();

    const user = await repository.findByEmail(email);

    if (user) {
      const passwordMatched = await compare(password, user.password);

      if (passwordMatched) {
        delete user.password;
        const { id, name, updatedAt, avatarId } = user;
        const avatar = avatarId
          ? await this.filesRepository.getOne(avatarId)
          : null;

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
          expiresIn,
          subject: id,
        });

        return {
          user: {
            name,
            updatedAt,
            avatar: avatar ? { url: avatar.path } : null,
          },
          token,
        };
      }
    }

    throw new AppError('Incorrect Email or Password');
  }
}

export default SessionsService;
