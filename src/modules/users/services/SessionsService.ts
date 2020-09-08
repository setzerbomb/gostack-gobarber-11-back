import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';

import IUsersRepository from '@modules/users/interfaces/repositories/IUsersRepository';
import IFilesRepository from '@modules/files/interfaces/repositories/IFilesRepository';

import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

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

  private hashProvider: IHashProvider;

  constructor(
    @inject('UsersRepository') usersRepository: IUsersRepository,
    @inject('FilesRepository') filesRepository: IFilesRepository,
    @inject('HashProvider') hashProvider: IHashProvider,
  ) {
    this.filesRepository = filesRepository;
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
  }

  private getRepository() {
    return this.usersRepository;
  }

  public async auth({ email, password }: IRequest): Promise<IResponse> {
    const repository = this.getRepository();

    const user = await repository.findByEmail(email);

    if (user) {
      const passwordMatched = await this.hashProvider.compareHash(
        password,
        user.password,
      );

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
