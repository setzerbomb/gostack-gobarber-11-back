import fs from 'fs';
import path from 'path';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/interfaces/repositories/IUsersRepository';
import IFilesRepository from '@modules/files/interfaces/repositories/IFilesRepository';

import AppError from '@shared/errors/AppError';

import uploadConfig from '@config/multer';
import { injectable, inject } from 'tsyringe';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IUpdateUserDTO from '@modules/users/interfaces/dtos/IUpdateUserDTO';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class UsersService {
  private usersRepository: IUsersRepository;

  private hashProvider: IHashProvider;

  private filesRepository: IFilesRepository;

  private storageProvider: IStorageProvider;

  constructor(
    @inject('UsersRepository') usersRepository: IUsersRepository,
    @inject('FilesRepository') filesRepository: IFilesRepository,
    @inject('HashProvider') hashProvider: IHashProvider,
    @inject('StorageProvider') storageProvider: IStorageProvider,
  ) {
    this.filesRepository = filesRepository;
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
    this.storageProvider = storageProvider;
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

  public async update({
    id,
    name,
    password,
    passwordConfirmation,
    avatar,
  }: IUpdateUserDTO): Promise<User> {
    const repository = this.getRepository();

    const user = await this.find(id);

    if (!user) throw new AppError('User not found');

    if (password !== passwordConfirmation)
      throw new AppError('Passwords are not matching');

    if (user.avatarId && avatar) {
      const file = await this.filesRepository.getOne(user.avatarId);

      if (file) {
        const userAvatarFilePath = path.join(
          uploadConfig.uploadsFolder,
          file.path,
        );
        const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

        if (userAvatarFileExists) {
          await this.storageProvider.deleteFile(userAvatarFilePath);
        }
        await this.filesRepository.delete(file.id);
      }
    }

    if (avatar) {
      user.avatarId = avatar;
      const foundAvatar = await this.filesRepository.getOne(avatar);
      if (foundAvatar) {
        user.avatar = foundAvatar;
        await this.storageProvider.saveFile(foundAvatar.path);
      }
    }

    user.name = name || user.name;
    user.password = password
      ? await this.hashProvider.generateHash(password)
      : user.password;

    await repository.update(user);

    return user;
  }

  public async store({ name, email, password }: IRequest): Promise<User> {
    const repository = this.getRepository();

    const checkUserExists = await repository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already used');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await repository.save({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export default UsersService;
