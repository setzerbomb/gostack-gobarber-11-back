import { getCustomRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import fs from 'fs';
import path from 'path';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/interfaces/repositories/IUsersRepository';
import IFilesRepository from '@modules/files/interfaces/repositories/IFilesRepository';

import AppError from '@shared/errors/AppError';

import uploadConfig from '@config/multer';
import { injectable, inject } from 'tsyringe';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class UsersService {
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

  public async find(id: string): Promise<User | undefined> {
    const repository = this.getRepository();

    const user = await repository.getOne(id);

    return user;
  }

  public async exists(id: string): Promise<boolean> {
    const repository = this.getRepository();

    const exists = (await repository.count(id)) > 0;

    return exists;
  }

  public async update(
    id: string,
    name: string | undefined,
    password: string | undefined,
    passwordConfirmation: string | undefined,
    avatar: string | undefined,
  ): Promise<User> {
    const repository = this.getRepository();

    const user = await this.find(id);

    if (!user) throw new AppError('User not found');

    if (password !== passwordConfirmation)
      throw new AppError('Passwords are not matching');

    if (user.avatarId && avatar) {
      const file = await this.filesRepository.getOne(user.avatarId);

      if (file) {
        const userAvatarFilePath = path.join(uploadConfig.directory, file.path);
        const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

        if (userAvatarFileExists) {
          await fs.promises.unlink(userAvatarFilePath);
        }
        await this.filesRepository.delete(file.id);
      }
    }

    if (avatar) {
      user.avatarId = avatar;
      const foundAvatar = await this.filesRepository.getOne(avatar);
      if (foundAvatar) user.avatar = foundAvatar;
    }

    user.name = name || user.name;
    user.password = password ? await hash(password, 8) : user.password;

    await repository.update(user);
    delete user.password;

    return user;
  }

  public async store({ name, email, password }: IRequest): Promise<User> {
    const repository = this.getRepository();

    const checkUserExists = await repository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already used');
    }

    const hashedPassword = await hash(password, 8);

    const user = await repository.save({
      name,
      email,
      password: hashedPassword,
    });

    delete user.password;

    return user;
  }
}

export default UsersService;
