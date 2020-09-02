import { getCustomRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import fs from 'fs';
import path from 'path';

import User from '../models/User';
import UsersRepository from '../repositories/UsersRepository';
import FileRepository from '../repositories/FilesRepository';

import AppError from '../errors/AppError';

import uploadConfig from '../../config/multer';

interface UserDTO {
  name: string;
  email: string;
  password: string;
}

class UsersService {
  private getRepository() {
    return getCustomRepository(UsersRepository);
  }

  public async find(id: string): Promise<User | undefined> {
    const repository = this.getRepository();

    const user = await repository.findOne(id);

    return user;
  }

  public async exists(id: string): Promise<boolean> {
    const repository = this.getRepository();

    const exists = (await repository.count({ id })) > 0;

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
      const file = await getCustomRepository(FileRepository).findOne(
        user.avatarId,
      );

      if (file) {
        const userAvatarFilePath = path.join(uploadConfig.directory, file.path);
        const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

        if (userAvatarFileExists) {
          await fs.promises.unlink(userAvatarFilePath);
        }
        await getCustomRepository(FileRepository).delete(file.id);
      }
    }

    if (avatar) {
      user.avatarId = avatar;
      const foundAvatar = await getCustomRepository(FileRepository).findOne(
        avatar,
      );
      if (foundAvatar) user.avatar = foundAvatar;
    }

    user.name = name || user.name;
    user.password = password ? await hash(password, 8) : user.password;

    await repository.save(user);
    delete user.password;

    return user;
  }

  public async store({ name, email, password }: UserDTO): Promise<User> {
    const repository = this.getRepository();

    const checkUserExists = await repository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already used');
    }

    const hashedPassword = await hash(password, 8);

    const user = repository.create({
      name,
      email,
      password: hashedPassword,
    });

    await repository.save(user);

    delete user.password;

    return user;
  }
}

export default UsersService;
