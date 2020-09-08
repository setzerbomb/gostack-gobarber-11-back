import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../interfaces/repositories/fakes/FakeUsersRepository';
import FakeFilesRepository from '../../files/interfaces/repositories/fakes/FakeFilesRepository';

import UsersService from './UsersService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('Users', () => {
  it('should be able to create a new user', async () => {
    const usersService = new UsersService(
      new FakeUsersRepository(),
      new FakeFilesRepository(),
      new FakeHashProvider(),
      new FakeStorageProvider(),
    );

    const user = await usersService.store({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create two users with the same email', async () => {
    const usersService = new UsersService(
      new FakeUsersRepository(),
      new FakeFilesRepository(),
      new FakeHashProvider(),
      new FakeStorageProvider(),
    );

    await usersService.store({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    return expect(
      usersService.store({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to add a user avatar', async () => {
    const usersService = new UsersService(
      new FakeUsersRepository(),
      new FakeFilesRepository(),
      new FakeHashProvider(),
      new FakeStorageProvider(),
    );

    const user = await usersService.store({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updateUser = await usersService.update({
      id: user.id,
      avatar: 'file',
    });

    return expect(updateUser.avatarId).toBe('file');
  });

  it('should be able to update a user avatar', async () => {
    const fakeStorageProvider: FakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const usersService = new UsersService(
      new FakeUsersRepository(),
      new FakeFilesRepository(),
      new FakeHashProvider(),
      fakeStorageProvider,
    );

    const user = await usersService.store({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await usersService.update({
      id: user.id,
      avatar: 'file',
    });

    const updateUser = await usersService.update({
      id: user.id,
      avatar: 'file2',
    });

    // expect(deleteFile).toHaveBeenCalledWith('file');

    return expect(updateUser.avatarId).toBe('file2');
  });

  it('should be able to update a user password', async () => {
    const usersService = new UsersService(
      new FakeUsersRepository(),
      new FakeFilesRepository(),
      new FakeHashProvider(),
      new FakeStorageProvider(),
    );

    const user = await usersService.store({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await usersService.update({
      id: user.id,
      password: '123',
      passwordConfirmation: '123',
    });

    return expect(updatedUser.password).toBe('123');
  });

  it('should not be able to update a user password that does not match with password confirmation', async () => {
    const usersService = new UsersService(
      new FakeUsersRepository(),
      new FakeFilesRepository(),
      new FakeHashProvider(),
      new FakeStorageProvider(),
    );

    const user = await usersService.store({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    return expect(
      usersService.update({
        id: user.id,
        password: '123',
        passwordConfirmation: '1',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a user when id is null', async () => {
    const usersService = new UsersService(
      new FakeUsersRepository(),
      new FakeFilesRepository(),
      new FakeHashProvider(),
      new FakeStorageProvider(),
    );

    return expect(
      usersService.update({
        id: 'null-user',
        avatar: 'file',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should return that user exists', async () => {
    const usersService = new UsersService(
      new FakeUsersRepository(),
      new FakeFilesRepository(),
      new FakeHashProvider(),
      new FakeStorageProvider(),
    );

    const user = await usersService.store({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(usersService.exists(user.id)).resolves.toBeTruthy();
  });
});
